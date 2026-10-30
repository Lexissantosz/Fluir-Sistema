const { defineConfig } = require("cypress");
module.exports = defineConfig({e2e:{baseUrl:"http://127.0.0.1:5500",specPattern:"cypress/e2e/**/*.cy.js",supportFile:false,video:false},viewportWidth:1280,viewportHeight:720});
