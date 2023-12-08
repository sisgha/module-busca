export type IUsuarioUpdatePasswordInput = {
  id: string;

  currentPassword: string;

  newPassword: string;
  confirmNewPassword: string;
};
