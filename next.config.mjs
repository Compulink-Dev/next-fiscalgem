import webpack from 'webpack'; // Import Webpack explicitly

const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        // Add a rule for resolving Sequelize modules to handle issues with MariaDB
        config.module.rules.push({
            test: /node_modules[\\/]sequelize[\\/]/,
            resolve: {
                fullySpecified: false, // Fix for Sequelize module resolution issues
            },
        });

        // Add a ContextReplacementPlugin to optimize Sequelize module loading
        config.plugins.push(
            new webpack.ContextReplacementPlugin(
                /sequelize[\\/]lib/,
                (context) => {
                    // If the request is for a dialect other than MariaDB, skip
                    if (!/\.\/mariadb/.test(context.request)) {
                        return;
                    }
                    // Customize the context replacement logic if needed
                }
            )
        );

        return config;
    },
};

export default nextConfig;
