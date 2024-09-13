// imports third party library
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/private'],
};
