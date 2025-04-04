export enum MessageKeys {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  NOT_FOUND = 'NOT_FOUND',
  FETCHED = 'FETCHED', // Yangi xabar
}

export const MESSAGES = {
  [MessageKeys.CREATED]: 'Resurs muvaffaqiyatli yaratildi',
  [MessageKeys.UPDATED]: "Ma'lumot muvaffaqiyatli yangilandi",
  [MessageKeys.DELETED]: "Ma'lumot muvaffaqiyatli o‘chirildi",
  [MessageKeys.NOT_FOUND]: "Ma'lumot topilmadi",
  [MessageKeys.FETCHED]: "Ma'lumotlar muvaffaqiyatli olingan",
};
