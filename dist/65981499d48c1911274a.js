importScripts("https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.2/spark-md5.min.js");const incrementalMD5=e=>new Promise(((a,s)=>{var r=0,t=(performance.now(),e.size);const n=new FileReader,o=new SparkMD5.ArrayBuffer,i=2097152,l=Math.ceil(e.size/i);let d=0;n.onload=e=>{o.append(e.target.result),++d,d<l?c():a(o.end())},n.addEventListener("progress",(e=>{r+=e.loaded,Math.round(r/t*100)})),n.addEventListener("loadend",(e=>{e.total>0&&performance.now()})),n.onerror=()=>s(n.error);const c=()=>{const a=d*i,s=a+i>=e.size?e.size:a+i;n.readAsArrayBuffer(File.prototype.slice.call(e,a,s))};c()}));self.onmessage=async function(e){if(e.data.file&&"begin hash"==e.data.msg){const a=await incrementalMD5(e.data.file);postMessage({status:"complete",hash:a}),self.close()}},postMessage({status:"ready"});