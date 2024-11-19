import SparkMD5 from "spark-md5";

// Function to calculate the checksum for multipart files
const calculateMultipartChecksum = (file, partSize) =>
  new Promise((resolve, reject) => {
    const chunkSize = partSize; // Use the part size from the API
    const chunks = Math.ceil(file.size / chunkSize); // Calculate the number of chunks (parts)
    const partChecksums = []; // Array to hold the checksum of each part

    let currentChunk = 0;
    const fileReader = new FileReader();
    const spark = new SparkMD5.ArrayBuffer();

    // Function to load the next chunk of the file
    const loadNext = () => {
      const start = currentChunk * chunkSize;
      const end =
        start + chunkSize >= file.size ? file.size : start + chunkSize;
      fileReader.readAsArrayBuffer(file.slice(start, end)); // Read the slice of the file
    };

    // FileReader's onload handler for processing the chunk
    fileReader.onload = (event) => {
      spark.append(event.target.result); // Append current chunk data to MD5 instance
      const partChecksum = spark.end(); // Generate the checksum for this part
      partChecksums.push(partChecksum); // Store the checksum of this part

      // Reset the SparkMD5 instance for the next chunk
      spark.reset();

      currentChunk++;
      if (currentChunk < chunks) {
        loadNext(); // Process the next chunk
      } else {
        // Step 2: Concatenate all part checksums
        const concatenatedPartChecksums = partChecksums.join("");

        // Step 3: Generate the final checksum of all parts
        const finalChecksum = SparkMD5.hash(concatenatedPartChecksums); // Hash the concatenated part checksums

        // Step 4: Append the number of parts to the final checksum
        const finalWithParts = finalChecksum + chunks; // Append the number of parts
        const finalFinalChecksum = SparkMD5.hash(finalWithParts); // Hash the final string with the number of parts

        resolve(finalFinalChecksum); // Resolve with the final checksum
      }
    };

    // Error handling for FileReader
    fileReader.onerror = () => reject(fileReader.error);

    // Start reading the first chunk
    loadNext();
  });

// Main worker handler
self.onmessage = async function (event) {
  if (event.data.file && event.data.msg == "begin hash") {
    console.log("ello chum!");
    const file = event.data.file;
    const multipartThreshold = PydioApi.getMultipartPartSize(); // Get the current multipart chunk size

    if (file.size > multipartThreshold) {
      // Only run multipart checksum logic for files above the threshold
      try {
        const finalChecksum = await calculateMultipartChecksum(
          file,
          multipartThreshold
        );
        postMessage({ status: "complete", hash: finalChecksum });
      } catch (error) {
        postMessage({ status: "error", message: error.message });
      }
    } else {
      // Use the original checksum process for small files (no multipart)
      const gmd5 = await incrementalMD5(file);
      postMessage({ status: "complete", hash: gmd5 });
    }
    self.close();
  }
};
