/*
 *  Copyright 2020 Adobe
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const paths = require('./paths');

// common function to get style loaders
// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = paths.clientLibRelativePath + '/';
// Some apps do not use client-side routing with pushState.
// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

// For these, "homepage" can be set to "." to enable relative asset paths.
const shouldUseRelativeAssetPaths = publicPath === './';

module.exports = (cssOptions, preProcessor) => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: Object.assign(
                {},
                shouldUseRelativeAssetPaths ? { publicPath: '../../' } : undefined
            ),
        },
        {
            loader: require.resolve('css-loader'),
            options: cssOptions,
        },
        {
            // package.json
            loader: require.resolve('postcss-loader'),
            options: {
                // Necessary for external CSS imports to work
                // https://github.com/facebook/create-react-app/issues/2677
                ident: 'postcss',
                plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    require('postcss-preset-env')({
                        autoprefixer: {
                            flexbox: 'no-2009',
                        },
                        stage: 3,
                    }),
                ],
                sourceMap: shouldUseSourceMap,
            },
        },
    ];
    if (preProcessor) {
        loaders.push({
            loader: require.resolve(preProcessor),
            options: {
                sourceMap: shouldUseSourceMap,
            },
        });
    }
    return loaders;
};