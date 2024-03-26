const scripts = [
    {
        "name":"he",
        "url":"https://cdn.jsdelivr.net/npm/he@1.2.0/he.min.js"
    },
    {
        "name":"swal",
        "url":"https://cdn.jsdelivr.net/npm/sweetalert2@11"
    },
    {
        "name":"papaparse",
        "url":"https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"
    },
    {
        "name":"chart.js",
        "url":"https://cdn.jsdelivr.net/npm/chart.js"
    },
    {
        "name":"spark-md5",
        "url":"https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.2/spark-md5.min.js"
    }
]

scripts.forEach(script=>{
    // Create a <script> element
    let s = document.createElement('script');

    // Set the source attribute to the CDN URL of the library
    s.src = script.url

    // Define a callback function to execute once the script is loaded
    s.onload = function() {
        // Code to execute after the library is loaded
        console.log('Loaded external library: ', script.name);
    };

    // Append the <script> element to the <head> section of the document
    document.head.appendChild(s);

})