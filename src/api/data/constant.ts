const ENDPOINTS = {
  GITHUB: {
    SEARCH_USER: 'https://api.github.com/search/',
    METAS: {
     REMAINING: "x-ratelimit-remaining",
     RATELIMIT: "x-ratelimit-reset",
     RESET: "x-ratelimit-reset"
    }
  },
};

  export default ENDPOINTS;