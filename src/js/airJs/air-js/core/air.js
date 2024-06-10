import { HTMLParser, domVersionParser, HTMLParserX, omegaParse} from "./vdomParser.js"
import { TimelineControlPanel } from "./stateHistoryMenu.js";
export const html = (strings, ...values) => {
  //console.log("v: ", values)
  return {
    strings,
    values,
    htmlTemplate:true
  }
};

let globalFocusElement = null;
const FocusManager = {
  focusPath: null,
  focusAttributes: null,
  setFocusAttributes(attributes){
    this.focusAttributes = attributes
  },
  setFocusPath(path) {
      this.focusPath = path;
  },
  getPathToElement(element){
    const path = [];
    while (element && element !== document.body) {
        const parent = element.parentNode;
        const index = Array.prototype.indexOf.call(parent.children, element);
        path.unshift(index);
        element = parent;
    }
    return path;
  },
  restoreFocus(root) {
      let element = root;
      for (const index of this.focusPath) {
          if (!element || index > element.children.length) return;
          element = element.children[index];
      }
      if (element) {
          element.focus();
          
          this.focusAttributes?.forEach(a=>{
            //first handling special attributes like caret position
            if (a.name === "selectionStart" && a.value > 0){ 
              element.selectionStart = a.value    
            }

          })
      }
  }
};


let performanceReports = [];

const monitorPerformance = (reportThreshold, monitorInterval, performanceDegradationThreshold) => {
  const generateStatusReport = () => {
    let totalTasks = 0, totalDeferred = 0, totalExecuted = 0;
    performanceReports.forEach(report => {
      totalTasks += report.total;
      totalDeferred += report.deferred;
      totalExecuted += report.executed;
    });

    const averageTime = performanceReports.reduce((acc, report) => acc + report.time, 0) / performanceReports.length;
    console.log(`Status Report: ${performanceReports.length} reports, Total: ${totalTasks}, Deferred: ${totalDeferred}, Executed: ${totalExecuted}, Average time: ${averageTime.toFixed(2)}ms`);
  };

  const checkForPerformanceDegradation = () => {
    const degradationReports = performanceReports.filter(report => report.time > performanceDegradationThreshold);
    if (degradationReports.length > 0) {
      performanceReports = [];
      console.warn(`Performance Degradation Detected: ${degradationReports.length} reports exceeding ${performanceDegradationThreshold}ms`);
    }
  };

  setInterval(() => {
    const reportSize = performanceReports.length;
    if (reportSize >= reportThreshold) {
      generateStatusReport();
      performanceReports.splice(0, reportSize);
    }
    checkForPerformanceDegradation();
  }, monitorInterval);
};

const REPORT_THRESHOLD = 200;
const MONITOR_INTERVAL = 5000;
const PERFORMANCE_DEGRADATION_THRESHOLD = 2;

monitorPerformance(REPORT_THRESHOLD, MONITOR_INTERVAL, PERFORMANCE_DEGRADATION_THRESHOLD);
class RenderManager {
  constructor(timeLimit = 150) { // Default time limit set to 16ms (about 60 FPS)
    this.primaryQueue = [];
    this.secondaryQueue = [];
    this.renderScheduled = false;
    this.timeLimit = timeLimit;
  }

  addPrimaryRender(fn) {
    this.primaryQueue.push(fn);
    this.scheduleRender();
  }

  addSecondaryRender(fn) {
    this.secondaryQueue.push(fn);
    this.scheduleRender();
  }

  executeTasks(queue) {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const startTime = performance.now();
        let endTime;

        // Execute tasks with a consideration for execution time
        while (queue.length > 0) {
          const task = queue.pop();
          task();
          endTime = performance.now();
          if (endTime - startTime > this.timeLimit) {
            //console.log("execution time: ", endTime-startTime, " switching to stepped mode")
            break; // Exit if the time limit is exceeded
          }
        }

        // Log performance; modified to include unexecuted task count
        performanceReports.push({total: queue.length, deferred:0,executed: this.primaryQueue.length - queue.length, time: endTime - startTime});

        resolve();
      });
    });
  }

  executeFinalTask(queue, isPrimary = false) {
    if (queue.length > 0) {
      const finalTask = queue.pop();
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          const startTime = performance.now();
          finalTask();
          const endTime = performance.now();

          if (isPrimary && endTime - startTime > this.timeLimit) {
            // If time exceeded and it's the primary queue, execute remaining tasks step by step
            return this.executeTasks(queue).then(resolve);
          } else {
            // Log performance; simplified for this execution path
            performanceReports.push({total: queue.length, deferred: queue.length, executed: 1, time: endTime - startTime});
            resolve();
          }
        });
      });
    } else {
      return Promise.resolve();
    }
  }

  scheduleRender() {
    if (!this.renderScheduled) {
      this.renderScheduled = true;
      // Start with the primary queue and then the secondary queue
      this.executeFinalTask(this.primaryQueue, true).then(() => {
        return this.executeFinalTask(this.secondaryQueue); // execute as normal without stepping through
      }).then(() => {
        // Clear queues and reset the flag
        this.primaryQueue = [];
        this.secondaryQueue = [];
        this.renderScheduled = false;
      });
    }
  }
}




class ReactiveState {
  constructor(initialValue) {
    let value = initialValue;
    const subscribers = new Set();
    const onUpdateSubscribers = new Set();
    this.prev = null;
    this.trim = () => value.trim();

    this.map = (renderFunc) => {
      const total = value.map(v => renderFunc(v));
      const getter = () => {
        const total = [];
        value.forEach(v => {  
          const {strings, values} = renderFunc(v);
          const renderedItem = currentComponent.processTemplate(strings, values);
          total.push(renderedItem);
        });
        return total.join('');  
      };

      return total.every(item => item && item.htmlTemplate) ? { get: getter, isStateArray: true } : total;
    };

    this.read = () => {
      const effect = getCurrentEffect();
      
      if (effect) {

        subscribers.add(effect);
      }
      return value;
    }; 

    this.onUpdate = (handler) => onUpdateSubscribers.add(handler);

    this.write = (newValue, proxy, options) => {
      this.prev = value
      if (typeof newValue === 'function') {
        newValue = newValue(value);
      }
      if (options && options.temporal && currentComponent.temporalHeap.has(proxy) && newValue?.source !== "stateHistory") {

        let currentValues = currentComponent.temporalHeap.get(proxy);
        if (currentValues.length >= (currentComponent.historyLength || 10)) {
            // Remove the oldest element when the max size is reached
            currentValues.shift();  
        }
        // Add the new value
        if (newValue){
          currentValues.push(newValue);
        }else{
          currentValues.push("null");
        }
        
        currentComponent.temporalHeap.set(proxy, currentValues);

        // Add padding value to all other sets
        currentComponent.temporalKeySet.forEach(key => {
          if (key[0] !== proxy && currentComponent.temporalHeap.has(key[0])) {
              let values = currentComponent.temporalHeap.get(key[0]);
              values.push("$padding");
              currentComponent.temporalHeap.set(key[0], values);
          }
        });
        if (currentComponent.timeWalk && currentComponent.timelineElement){
          currentComponent.timelineElement.setData(currentComponent.temporalHeap, currentComponent.temporalKeySet)
        }
      }
      if (newValue !== value) {
        value = newValue;
        

          // Schedule direct subscribers on the primary queue
          currentComponent.renderManager.addPrimaryRender(() => {
            subscribers.forEach(sub => sub(value));
          });
  
          // Schedule onUpdate subscribers on the secondary queue
          currentComponent.renderManager.addSecondaryRender(() => {
            onUpdateSubscribers.forEach(sub => sub(value));
          });

      }
    };

    this[Symbol.toPrimitive] = (hint) => {
      return hint === 'string' ? String(this.read()) : (hint === 'number' ? Number(this.read()) : this.read());
    };
  }
}

let airGlobalStateHeap = null

const createSignal = (initialValue, options) => {
  const state = new ReactiveState(initialValue);
  
  
  // Define a function to act as the target for the proxy
  const targetFunction = function() {
    return state.read(); // Or any logic you want when the proxy is called as a function
  };

  // Attach the state instance to the function
  targetFunction.state = state;


  const proxy = new Proxy(targetFunction, {
    apply(target, thisArg, argumentsList) {
      // Call the target function
      return target.apply(thisArg, argumentsList);
    },

    get(target, prop, receiver) {
      try {
        if (prop === Symbol.toPrimitive) {
          return target.state[Symbol.toPrimitive].bind(target.state);
        }
          // if prop = "revert" send last value, this is default behaviour unrelated to temporality and only records the previous value
        if (prop === 'revert'){
          target.state.write(target.state.prev)
          return (...args)=>{
           if (args?.length === 1 && typeof args[0] === "function"){
            args[0]()
           }else if (args?.length !== 0){
            throw new Error("Invalid revert callback argument. Must be a function.")
           }
          };
        }
        if (prop === 'valueOf') {
  
          return () => target.state.read();
        }

        if (prop === 'state') {
          return target.state;
        }

        const currentValue = target.state.read();

        // Handle the case when `myVar` is accessed directly
        if (prop === 'then') {
          // To ensure compatibility with Promise-like behavior
          return undefined;
        }

        if (prop === 'trim') {
          return target.state.trim;
        }

        if (prop === 'onUpdate') {
          return target.state.onUpdate;
        }

        if (currentValue && typeof currentValue === 'object') {
          if (prop in currentValue) {
            const property = currentValue[prop];
            return typeof property === 'function' ? property.bind(currentValue) : property;
          }
        }

        if (prop === 'toLowerCase' && typeof currentValue === 'string') {
          return () => currentValue.toLowerCase();
        }

        // Check if the property exists on the target function itself
        if (prop in target) {
          return target[prop];
        }

        // Default case: return the current value
        // Handle other property access or methods
      return Reflect.get(...arguments);
        return currentValue;
      } catch (error) {
        console.error("Error accessing property:", prop, error);
        throw error; // Optionally rethrow or handle the error differently
      }
    }
  });

  if(options){ 
    const system = options?.global //avoid conflict with node window keyword
    const temporal = options?.temporal
    system && (airGlobalStateHeap = airGlobalStateHeap || new Map()).set(system, [proxy, (newValue) => {
      state.write(newValue);
    }]);
    temporal && (currentComponent.temporalHeap = currentComponent.temporalHeap || new WeakMap()).set(proxy, [initialValue]); // if temporalHeap is still null, instantiate the internal array of states with the init value.
    currentComponent.temporalKeySet.add([proxy,(newValue) => {
      state.write(newValue, proxy, options);}])
  }

  return [proxy, (newValue) => {
    state.write(newValue, proxy, options);
  }];
};

export const createState = (initialValue, options) => { // options, "global", "temporal"
  if (options && typeof options !== "object") {
    throw new Error("Invalid argument: createState options must be an object.");
  } else if (options?.temporal && typeof options.temporal !== "boolean") {
    throw new Error(`Invalid createState temporal parameter: options.temporal must be boolean, got ${typeof options.temporal}`);
  } else if (options?.global && typeof options.global !== "string") {
    throw new Error(`Invalid createState global parameter: options.global must be the global ID as a string, got ${typeof options.global}`);
  }
  
  const [value, setValue] = createSignal(initialValue, options);
  return [value, setValue];
};
export const globalState = (id) => {
  if (!airGlobalStateHeap){
    throw new Error("Global stateheap not initialised, cannot retrieve any values")
  }else if (airGlobalStateHeap.has(id)) {
    return airGlobalStateHeap.get(id);
  } else {
    throw new Error("Could not find a value in the global stateheap with the ID: " + id)
  }
}
const createEffect = (fn) => {
  const execute = () => {
    cleanupEffect();
    setCurrentEffect(execute);
    fn();
    setCurrentEffect(null);
  };
  const cleanupEffect = () => {
    // Logic to remove old effects or clean up resources
    if (currentEffect && currentEffect.cleanup) {

      currentEffect.cleanup();
    }
  };
  execute();
  return { cleanup: cleanupEffect };
};

let currentEffect = null;
const setCurrentEffect = (effect) => {
  currentEffect = effect;
};

const getCurrentEffect = () => currentEffect;

// Use `instanceof` to check if it is reactive state
const isReactiveState = (value) => value instanceof ReactiveState;


let currentComponent = null;
const setCurrentComponent = (component) => {
  currentComponent = component;
};
function analyzeCode(code, strictMode = false) {
  const createStateRegex = /const \[([a-zA-Z0-9_]+),/g;
  let variables = [];

  let match;
  while ((match = createStateRegex.exec(code)) !== null) {
    variables.push(match[1]);
  }

  let usageResults = {};
  variables.forEach(variable => {
    const regex = new RegExp(`\\b${variable}\\b(?!\\()`, 'g');
    let firstOccurrence = true;
    let usages = [];

    while ((match = regex.exec(code)) !== null) {
      if (firstOccurrence) {
        firstOccurrence = false;
        continue;
      }

      const position = match.index;
      const postVarIndex = position + variable.length;
      const postVarSnippet = code.slice(postVarIndex).trimStart();
      const nextChar = postVarSnippet[0];

      // Determine validity based on strict or non-strict mode
      let isValid = true; // Assume valid by default
      if (strictMode) {
        isValid = nextChar === '('; // In strict mode, all usages must invoke
      } else {
        // Non-strict mode only concerns logical operations and equality checks
        isValid = !(/\s*(\?|&&|\|\||==|!=)/.test(postVarSnippet)); // Check for risky logical or equality usage
        if (/[\+\-\*\/]/.test(postVarSnippet.trim()[0])) {
          isValid = true; // Allow arithmetic operations in non-strict mode
        }
      }

      // Find the full line by searching for nearest line breaks around the match
      let start = code.lastIndexOf('\n', position - 1) + 1;
      let end = code.indexOf('\n', position);
      if (end === -1) { end = code.length; } // Handle case where no newline at end
      let snippet = code.substring(start, end);

      usages.push({
        position: position,
        valid: isValid,
        snippet: snippet
      });
    }
    usageResults[variable] = usages;
  });

  return usageResults;
}


function logErrors(filteredObject, strict) {
  Object.entries(filteredObject).forEach(([key, errors]) => {
    errors.forEach(error => {
      if (!strict) console.warn(`Warning: Uninvoked proxy usage detected with ${key}. Proxies should be invoked in logical and equality operations to ensure correct behavior. (Position ${error.position}): ${error.snippet}`);
      else console.error(`Error: Detected uninvoked proxy. Proxies must be invoked on every access in strict mode. (Position ${error.position}): ${error.snippet}`
    )
    });
  });
}


const globalProps = new Map();
export const AirComponent = (elementName, component) => {
  class CustomElement extends HTMLElement {
    constructor() {
      super();
      
      this.checkProps()
      this.state = new Map();
      this.eventHandlers = new Map();
      this.isInitialRender = true;  // Flag to check if it's the first render
      this.psuedoStylesheet = null
      this.secondParser = new HTMLParser()
      this.previousVdom = null;
      this.currentVdom = null;
      this.focusElement = null;
      this.historyLength = 10
      this.timeWalk = false;
      this.renderManager = new RenderManager;
      this.temporalHeap = null;
      this.temporalKeySet = new Set();
      this.strict = false;
    }
    setOnMount(f){
      this.onMount = f
    }
    checkProps(){
  
      const id = this.getAttribute("air_props_id")
      if (id){

        this.props = globalProps.get(id)
      }
      
    }
    connectedCallback() {
      console.log("running connected callback")

      setCurrentComponent(this);
      const cleanupEffects = [];
      
      // Encapsulate component execution in an effect context
      const cleanup = createEffect(() => {
        setCurrentComponent(this);
        this.startTime = performance.now()
        //this.eventHandlers.clear();
        if (this.isInitialRender) {
          
          // On initial render, call the component function to initialize states
          const t = component.call(this, this.props);
          if (this.strict) console.warn(`Strict Mode is enabled for component "${elementName}". All state variables must be invoked with parentheses (e.g., 'variable()') to ensure interactions with their actual values and not the proxy objects. This mode enforces strict syntax to prevent common proxy-related issues.
          `)
          if (typeof t !== "function"){
            throw new Error("Component must return a functional template.")
          }
          const inter = t()
          if (!inter.strings || !inter.values || !inter.htmlTemplate){
            throw new Error("Component must generate a valid HTML template literal")
          }
          const {strings, values} = inter
          //console.log("strings: ", strings, " values: ", values)
          this.template = t  // Store the template for reprocessing
          
          const processedTemplate = this.processTemplate(strings, values);
          
          //console.log("processed template 1: ", processedTemplate)
          this.innerHTML = processedTemplate;
          
          // Set up event handlers
          this.attachEventListeners()
          this.isInitialRender = false;  // Subsequent renders will not re-initialize state
        }

        //setup focus retention
        let focusPath = null;
        if (document.activeElement) {
          const activeEl = document.activeElement
          focusPath = FocusManager.getPathToElement(activeEl);
          if (activeEl.tagName === "INPUT" && activeEl.getAttribute("type") === "text"){
            FocusManager.setFocusAttributes([{name:"selectionStart",value:activeEl.selectionStart}])
          }
        }
        // clean psuedo styles
        if (this.psuedoStylesheet){
          this.psuedoStylesheet.innerHTML = ""
        }
        // Process the stored template
        const {strings, values} = this.template()
        const lintWarnings = analyzeCode(component.toString(), this.strict)
        //const invalid = Object.keys(lintWarnings).map(key => lintWarnings[key].filter(e => !e.valid));
        const invalid = Object.fromEntries(Object.entries(lintWarnings).map(([key, arr]) => [key, arr.filter(item => !item.valid)]));

        console.log("tempepe@ ", invalid)
        logErrors(invalid, this.strict)
        //const strings = [...this.template.strings]
        //const values = [...this.template.values]
        this.eventHandlers.clear()
        const processedTemplate = this.processTemplate(strings, values);

        //console.log("processed template 2: ", processedTemplate)
        if (this.previousVdom){
          updateElement(this,processedTemplate)
        }

        
        setTimeout(()=>{
          requestAnimationFrame(() => {
            if (this.previousVdom){
              this.attachEventListeners()
            }
            
            if (this.psuedoStylesheet){
              this.appendChild(this.psuedoStylesheet)
            }
            
            if (FocusManager.focusPath) {
  
                //FocusManager.restoreFocus(document.body);
                
            }
            this.previousVdom = processedTemplate
          });
          
        },1)
        
        this.endTime = performance.now()
        FocusManager.setFocusPath(focusPath); //execute refocus
        //console.log(`Individual rerender job took ${this.endTime - this.startTime} milliseconds.`);

        // Setup timewalk
        if(typeof this.timeWalk === "boolean" && this.timeWalk === true){
          if (!this.timelineElement){
            
            this.timelineElement = document.createElement('timeline-control-panel');
            document.body.appendChild(this.timelineElement);
            
            this.timelineElement.render()
          }
          
         
        }else if (this.timeWalk){
          throw new Error("Invalid component timeWalk value. Expected boolean, got: " + typeof this.timeWalk)
        }
      });
 
      cleanupEffects.push(cleanup);
      
      // Save cleanup for each effect
      this.cleanupEffects = cleanupEffects;

   

      this.triggerOnMount()
      
    }
    
    attachEventListeners() {
      // Create a new map to store events that still need to be processed
      let remainingEvents = new Map();
    
      // Iterate over the event handlers
      this.eventHandlers.forEach((events, id) => {
        let targetElement = this.querySelector(`[${id}]`);
        
        //targetElement = this.removeEventAllListeners(targetElement)
        // Iterate over each event for the current element
        events.forEach((event) => {
          if (targetElement) {
            // Remove the existing event handler
            //targetElement.removeEventListener(event.event.substring(2), event.handler);
            targetElement[event.event] = event.handler
           
            // Add the new event handler
            //targetElement.addEventListener(event.event.substring(2), event.handler);
          }
        });
    
        // If there are still events left for this element, add them to the remainingEvents map
        if (events.length > 0) {
          remainingEvents.set(id, events);
        } else {
          // Remove the attribute if no events are left
          if (targetElement) {
            targetElement.removeAttribute("air_event_id");
          }
        }
      });
   
      // Update this.eventHandlers with the remaining events
      this.eventHandlers = remainingEvents;
    }
    
    removeEventAllListeners(element) {
      const newElement = element.cloneNode(true);
      element.replaceWith(newElement);
      return newElement; // return the new element if you need to reference it
    }
    disconnectedCallback() {

      if (this.cleanupEffects) {
        this.cleanupEffects.forEach(cleanup => cleanup.cleanup && cleanup.cleanup());
      }
      this.onUnmount();
    }

    triggerOnMount = () => {
      if (this.onMount){
        this.onMount()

      }else{
        console.log('Component mounted');
      }
      
    };

    onUnmount = () => {
      console.log('Component unmounted');
    };

    
    processTemplate = (strings, values) => {

      return strings.reduce((result, string, i) => {
        let currentResult = result + string;
        const match = string.match(/\s(\w+)=/g);
        const attrName = match ? match[match.length - 1].trim().split('=')[0] : null;
        
        if (i < values.length) {
            //console.log("va: ", values[i])
            if (isReactiveState(values[i])) {
              
              currentResult += values[i].read;
            }else if (values[i]?.isStateArray === true){

              console.log(values[i])
              const renderedArray = values[i].get();
              currentResult += renderedArray
              
            }else if (typeof values[i] === 'object' && values[i]?.htmlTemplate){
              
              const renderedArray = this.processTemplate(values[i].strings, values[i].values)
              currentResult += renderedArray
            }
            else if (typeof values[i] === 'function' && /on\w+="$/.test(string)) {
                // Generate an ID for the element if it does not have one yet
                const existingId = extractAttribute(currentResult, "air_event_id")
                const id = existingId || Math.random().toString(36).substring(2, 10).trim();
    
                const funcId = `air_event_id="${id}"`;

                const existing = currentComponent.eventHandlers.get(funcId) || [];
                // Store the function globally accessible with a unique ID]
                //console.log("adding event listener: ", values[i])
                currentComponent.eventHandlers.set(funcId, [...existing,{"event": attrName, "handler":values[i]}])               
                // Instead of directly invoking, create a call reference that can be executed
                //console.log("evenet handlers now: ", currentComponent.eventHandlers)
                currentResult = currentResult.substring(0, currentResult.length-(attrName.length+2));
                if (!existingId){
                  currentResult += `air_event_id="${id}`;
                }
              
            }else if (typeof values[i] === 'function' && !/on\w+="$/.test(string)){
              let renderedVar = values[i]()
              if(isReactiveState(renderedVar)){
                renderedVar = renderedVar.read
              }
              if (!renderedVar){ //result is nullish
                currentResult += renderedVar
                
              }else
              if (typeof renderedVar === "object"){
                if (renderedVar.htmlTemplate){
                  const renderedTemplate = this.processTemplate(renderedVar.strings, renderedVar.values)
                  currentResult += renderedTemplate;
                }else 
                {
                  currentResult += renderedVar
                }
              }else{
                currentResult += renderedVar
              }
              //currentResult += values[i]();
            }
            else if (Array.isArray(values[i])) {
              
              //console.log("array val@ ", values[i])
              const d = []
              processNestedArray(values[i], item => {
                // process arrays recursively
                if (item.htmlTemplate){
                  d.push(this.processTemplate(item.strings, item.values))
                }
                
              });
              currentResult += d.join("")
           
              
            }else if(typeof values[i] === 'object' && string.endsWith("props=")){
              const tagMatch = string.match(/<([^ ]+) props=/);
              const tagName = match ? tagMatch[1] : null;

              const isCustomElement = customElements.get(tagName) !== undefined;
              if (isCustomElement){ //set global probs as weakmap with entries being one for each component, entry contains array of objects, each object is a "props=" in that component
                const existingId = extractAttribute(currentResult, "air_props_id")

                const id = existingId || Math.random().toString(36).substring(2, 10).trim();
    
                const funcId = `air_props_id="${id}"`;

                const existing = globalProps.get(id)
                if (existing){
                  throw new Error("cannot initialise more than one properties object on a component.")
                }
                globalProps.set(id, values[i])
                currentResult=currentResult.replace("props=",funcId)

              }
              
              
            }else if(typeof values[i] === 'object'){

              currentResult += JSON.stringify(values[i]);
            } else {
                // Directly append other types of values
                currentResult += values[i];
            }
        }
        return currentResult;
    }, '');
    }
  }
  if (!customElements.get(elementName)){
    customElements.define(elementName, CustomElement);
  }else{
    console.log("component ", elementName, " already defined.")
  }
  
  return component;
};
function processNestedArray(array, action) {
  array.forEach(item => {
      if (Array.isArray(item)) {
          // If the item is an array, recurse into it
          processNestedArray(item, action);
      } else {
          // If the item is not an array, perform the action
          action(item);
      }
  });
}
function extractAttribute(str, attribute) {
  const parts = str.split(/<(?!.*<)/); // Split at the last occurrence of <
  const afterLastTag = parts[1] || '';
  const regex = new RegExp(`${attribute}="([^"]*)"`);
  const match = afterLastTag.match(regex);
  return match ? match[1] : null;
}
function updateElement(targetElement, newHtmlString) {


  const newTemplate = targetElement.cloneNode(false);
  newTemplate.innerHTML = newHtmlString.replace(/\n/g, '');
  //console.log("new: ", newTemplate)
  function isCustomElement(node) {
      return node.nodeType === Node.ELEMENT_NODE && customElements.get(node.nodeName.toLowerCase());
  }

  function updateAttributes(current, updated) {
      if (!updated.attributes){
        console.log("something wrong with attributes: ", current, updated)
        return
      }
      Array.from(updated.attributes).forEach(attr => {
          if (current.getAttribute(attr.name) !== attr.value) {
              current.setAttribute(attr.name, attr.value);
          }
      });
      Array.from(current.attributes).forEach(attr => {
          if (!updated.hasAttribute(attr.name)) {
              current.removeAttribute(attr.name);
          }
      });
  }

  function updateDom(current, updated, isRoot = false) {
      // Handle text node updates
      if (current.nodeType === Node.TEXT_NODE && updated.nodeType === Node.TEXT_NODE) {
          if (current.nodeValue !== updated.nodeValue) {
              current.nodeValue = updated.nodeValue;
          }
          return;
      }

      // Check if the current node or updated node is a custom element
      const currentIsCustom = isCustomElement(current);
      const updatedIsCustom = isCustomElement(updated);

      if (!isRoot && (currentIsCustom || updatedIsCustom)) {
          // If it's a nested custom element, update attributes only
          if (currentIsCustom && updatedIsCustom) {
              updateAttributes(current, updated);
          }
          return;
      }

      // Replace the node if the type is different (e.g., DIV vs SPAN)
      if (current.nodeType === Node.ELEMENT_NODE && updated.nodeType === Node.ELEMENT_NODE) {
          if (current.nodeName !== updated.nodeName) {
              const replacementNode = updated.cloneNode(true);
              current.parentNode.replaceChild(replacementNode, current);
              return;
          }
      }

      // Update attributes for elements
      if (current.nodeType === Node.ELEMENT_NODE && updated.nodeType !== Node.TEXT_NODE) {

          updateAttributes(current, updated);
      }

      // Update child nodes
      while (current.childNodes.length > updated.childNodes.length) {
          current.removeChild(current.lastChild);
      }

      updated.childNodes.forEach((updatedChild, index) => {
          if (index < current.childNodes.length) {
              updateDom(current.childNodes[index], updatedChild);
          } else {
              const clonedNode = updatedChild.cloneNode(true);
              current.appendChild(clonedNode);
          }
      });
  }

  updateDom(targetElement, newTemplate, true);
}


export const airCss = (styles) => {

  const parse = () => {
    if (typeof styles === "function"){
      console.log("functional style: ") //hmmmm need to think about this.
    }
    let styleString = '';
    let endData = null;
    let psuedoId = null;
    const processGroup = (group, properties) => {
      if (typeof properties !== "object"){
        if (isValidCSSProperty(group)){
          group = group.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
          if (typeof properties === "function"){
            properties = properties()
          }
        }
        //unary style like opacity. 
        styleString += `${group}: ${properties}; `;
        //return
      }else{
        
        Object.keys(properties).forEach(property => {
        
          let value = properties[property];
  
          if (isReactiveState(value)){
  
            value = value
            //return
          }
          
          if (typeof value === 'function') {
  
            value = value();
          }
          if (group === "font" && property === "color"){
            styleString += `${property}: ${value}; `;
          }else{
  
            styleString += `${group}-${property}: ${value}; `;
          }
          
        });
      }
      
      
    };
    const processPsuedoElement = (group, properties) =>{
      if (!currentComponent){
      throw new Error("Invalid component context")
      }
      
      const styleRules = []
      Object.keys(properties).forEach(property => {
        let value = properties[property];
        if (typeof value !== "object"){
          //unary
          if (isValidCSSProperty(property)){
            property = property.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            if (typeof value === "function"){
              value = value()
            }

            styleRules.push({property, value})
          }

        }else{
          Object.keys(value).forEach(psuedoProperty=>{
            let psuedoValue = value[psuedoProperty]

            if (typeof psuedoValue === 'function') {
  
              psuedoValue = psuedoValue();
            }
            if (property === "font" && psuedoProperty === "color"){

              styleRules.push({property:psuedoProperty, value:psuedoValue})
            }else{
              styleRules.push({property:`${property}-${psuedoProperty}`, value:psuedoValue})

            }
          })
        }
        
      });

      if (styleRules.length>0){
        if (!psuedoId){
          psuedoId = Math.random().toString(36).substring(2, 10).trim()
        }
        const cssString = generatePseudoElementCSS(styleRules, psuedoId,  group.replace("__",""));

        if (!currentComponent.psuedoStylesheet){
          const styleSheet = document.createElement("style")
          styleSheet.innerHTML += cssString
          currentComponent.psuedoStylesheet = styleSheet
        }else{
          currentComponent.psuedoStylesheet.innerHTML += cssString
        }

        if (!endData){
          endData = psuedoId
        }
       
      }
      
    }
    const isValidCSSProperty = (property) => {
      // Convert camelCase to kebab-case
      const kebabCaseProperty = property.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      
      // Check if the property is supported
      return CSS.supports(kebabCaseProperty, 'initial');
    }

    const generatePseudoElementCSS = (properties, customId, pseudoElement) => {
      // Construct the custom selector with the pseudo-element
      let selector = `[air_psuedo_element_id="${customId}"]:${pseudoElement}`;
  
      // Initialize the CSS string with the selector
      let cssString = `${selector} {`;
  
      // Loop through the properties array to add each property and value to the CSS string
      properties.forEach(prop => {
          cssString += ` ${prop.property}: ${prop.value};`;
      });
  
      // Close the CSS block
      cssString += ' }';
  
      return cssString;
    }
    
   
    

  
  
    Object.keys(styles).forEach(group => {
      
        if (!group.startsWith("__")){
          processGroup(group, styles[group]);
        }else{
          return processPsuedoElement(group, styles[group])
        }
        

    });
    if (endData){

      const uniqueClass = `"air_psuedo_element_id="${endData}`
      styleString = styleString.trim() + uniqueClass.trim()
    }
    return styleString.trim();
  };

  return parse
};