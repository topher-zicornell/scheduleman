/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: "http://localhost:5001",
    TRIGGER_URL: "http://localhost:5003",
  }
};

export default nextConfig;
