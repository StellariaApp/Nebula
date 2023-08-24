/** @type {import('next').NextConfig} */

const { createExcss } = require("excss/next");

const withExcss = createExcss({
    // excss options,
});

const nextConfig = {}

module.exports = withExcss(nextConfig);