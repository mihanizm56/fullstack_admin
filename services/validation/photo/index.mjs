export const photoValidation = file =>
  new Promise((resolve, reject) => {
    file.originalname && file.size ? resolve() : reject();
  });
