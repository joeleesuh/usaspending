const presets = [
    [
        "@babel/preset-env",
        {
            useBuiltIns: 'entry',
            debug: true,
            corejs: {
                version: 3,
                proposals: true
            }
        }
    ],
    "@babel/preset-react"
];

const plugins = [
    [
        "module-resolver",
        {
            root: ["src/js"]
        }
    ],
    "@babel/plugin-transform-runtime",
    "@babel/plugin-syntax-dynamic-import"
];

module.exports = {
    presets,
    plugins,
    sourceMaps: process.env.NODE_ENV === 'development'
};
