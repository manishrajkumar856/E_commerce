import ImageKit, { toFile } from '@imagekit/nodejs';
import config from '../config/config.js';

const imagekit = new ImageKit({
    privateKey: config.IMAGE_KIT_PRIVATE_KEY,
});

export const uploadFile = async ({buffer, fileName, folder}) =>{
    const result = await imagekit.files.upload({
        file: await toFile(Buffer.from(buffer), 'file'),
        fileName,
        folder, folder
    });

    return result;
}