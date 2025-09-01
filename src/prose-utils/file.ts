/**
 * 获取文件名
 *
 * @example
 *   > extractFilename('https://gitlab.com/images/logo-full.png')
 *   < 'logo-full'
 *
 * @param {string} src The URL to extract filename from
 * @returns {string}
 */
export const extractFilename = (src: string): string => {
  return src.replace(/^.*\/|\..+?$/g, '');
};

/**
 * 获取文件扩展名
 * @param {string} fileName 文件名
 * @returns  {string}
 */
export const extractFileExtension = (fileName: string): string => {
  return fileName.split('.').pop() || '';
};

export const normalizeFileSize = (size: number): string => {
  if (size < 1024) {
    return size + ' Byte';
  }
  if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB';
  }
  return (size / 1024 / 1024).toFixed(2) + ' MB';
};

export type FileType = 'image' | 'audio' | 'video' | 'pdf' | 'document' | 'archive' | 'code' | 'file';

export const normalizeFileType = (fileType: string): FileType => {
  if (!fileType) return 'file';

  // PDF 文件
  if (fileType === 'application/pdf') return 'pdf';

  // 图片文件
  if (fileType.startsWith('image/')) {
    return 'image';
  }

  // 音频文件
  if (fileType.startsWith('audio/')) {
    return 'audio';
  }

  // 视频文件
  if (fileType.startsWith('video/')) {
    return 'video';
  }

  // 文档文件 - Microsoft Office
  if (fileType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
      fileType.includes('application/msword') ||
      fileType.includes('application/vnd.ms-word') ||
      fileType.includes('text/rtf') ||
      fileType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ||
      fileType.includes('application/vnd.ms-excel') ||
      fileType.includes('application/vnd.ms-excel.sheet') ||
      fileType.includes('application/vnd.openxmlformats-officedocument.presentationml.presentation') ||
      fileType.includes('application/vnd.ms-powerpoint') ||
      fileType.includes('application/vnd.ms-powerpoint.presentation')) {
    return 'document';
  }

  // 压缩文件
  if (fileType.includes('application/zip') ||
      fileType.includes('application/x-rar-compressed') ||
      fileType.includes('application/x-7z-compressed') ||
      fileType.includes('application/x-tar') ||
      fileType.includes('application/gzip') ||
      fileType.includes('application/x-gzip')) {
    return 'archive';
  }

  // 代码文件
  if (fileType.includes('text/javascript') ||
      fileType.includes('application/javascript') ||
      fileType.includes('text/typescript') ||
      fileType.includes('text/x-python') ||
      fileType.includes('text/x-java-source') ||
      fileType.includes('text/x-c++src') ||
      fileType.includes('text/x-csharp') ||
      fileType.includes('text/x-php') ||
      fileType.includes('text/x-ruby') ||
      fileType.includes('text/x-go') ||
      fileType.includes('text/x-rust') ||
      fileType.includes('text/x-sql') ||
      fileType.includes('text/x-sh') ||
      fileType.includes('text/yaml') ||
      fileType.includes('text/xml') ||
      fileType.includes('application/json') ||
      fileType.includes('text/html') ||
      fileType.includes('text/css') ||
      fileType.includes('text/plain')) {
    return 'code';
  }

  return 'file';
};

export const readImageAsBase64 = (file: File): Promise<{ alt: string; src: string }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        resolve({
          alt: file.name,
          src: reader.result as string,
        });
      },
      false
    );
    reader.readAsDataURL(file);
  });
};

export const getImageWidthHeight = (url: string): Promise<{ width: number | string; height: number | string }> => {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      resolve({ width: 'auto', height: 'auto' });
    };
    img.src = url;
  });
};
