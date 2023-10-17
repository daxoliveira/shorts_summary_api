import ytdl from "ytdl-core"
import fs from "fs"

// Before calling ytdl, ensure the 'tmp' directory exists
if (!fs.existsSync("./tmp")) {
  fs.mkdirSync("./tmp")
}

export const download = (videoId) =>
  new Promise((resolve, reject) => {
    const videoUrl = "https://www.youtube.com/shorts/" + videoId
    console.log("New Video URL: ", videoUrl)
    const filePath = "./tmp/audio.mp4"
    console.log("Downloading video..." + videoId)

    const writeStream = fs.createWriteStream(filePath)

    ytdl(videoUrl, { quality: "lowestaudio", filter: "audioonly" })
      .on("info", (info) => {
        const seconds = info.formats[0].approxDurationMs / 1000

        if (seconds > 60) {
          console.error("Video is too long. Max length is 60 seconds.")
          reject(new Error("Video is too long. Max length is 60 seconds."))
        }
      })
      .on("end", () => {
        console.log("Download finished.")
        resolve()
      })
      .on("error", (error) => {
        console.error("Error: " + error)
        reject(error)
      })
      .pipe(writeStream)

    // Handle any writeStream errors
    writeStream.on("error", (error) => {
      console.error("WriteStream error: " + error)
      reject(error)
    })
  })

// export const download = (videoId) =>
//   new Promise((resolve, reject) => {
//     const videoUrl = "https://www.youtube.com/shorts/" + videoId
//     console.log("Downloading video..." + videoId)

//     ytdl(videoUrl, { quality: "lowestaudio", filter: "audioonly" })
//       .on("info", (info) => {
//         const seconds = info.formats[0].approxDurationMs / 1000

//         if (seconds > 60) {
//           throw new Error("Video is too long. Max length is 60 seconds.")
//         }
//       })
//       .on("end", () => {
//         console.log("Download finished.")
//         resolve()
//       })
//       .on("error", (error) => {
//         console.log("Error: " + error)
//         reject(error)
//       })
//       .pipe(fs.createWriteStream("./tmp/audio.mp4"))
//   })
