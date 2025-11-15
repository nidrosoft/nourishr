export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpPayload extends AuthCredentials {
  fullName: string;
  confirmPassword: string;
}

export interface PhoneAuthPayload {
  phone: string;
  code?: string;
}
