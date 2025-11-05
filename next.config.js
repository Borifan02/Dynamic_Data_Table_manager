/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // enables static HTML export
  images: {
    unoptimized: true, // disables Next.js image optimization (not supported on GitHub Pages)
  },
  basePath: '/Dynamic_Data_Table_manager', // your GitHub repo name
  assetPrefix: '/Dynamic_Data_Table_manager/', // ensures correct asset paths
};

module.exports = nextConfig
