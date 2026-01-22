const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  COMMUNITY: "/community",
  COLLECTIONS: "/collections",
  JOBS: "/find-jobs",
  TAGS: `/tags`,
  PROFILE: (id: string) => `/profile/${id}`,
  // PROFILE: "/profile",
  ASK_QUESTION: "/ask-a-question",
  QUESTION: (id: string) => `/question/${id}`,
  // TAGS: (id: string) => `/tags/${id}`,
};

export default ROUTES;
