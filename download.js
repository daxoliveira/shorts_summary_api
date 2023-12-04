import axios from "axios";
import * as fs from "fs";
import * as path from "path";

const download = async (videoId) => {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const outputPath = path.join(__dirname, "temp", `${videoId}.mp4`);

  try {
    const response = await axios({
      method: "get",
      url: videoUrl,
      responseType: "stream",
    });

    if (response.status !== 200) {
      throw new Error(`Failed to download video. Status code: ${response.status}`);
    }

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.error(error);
    throw new Error(`Error downloading video: ${error.message}`);
  }
};

export { download };
