import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';


function babelCleanup() {

	const doubleSpaces = / {2}/g;

	return {

		transform( code ) {

			code = code.replace( doubleSpaces, '\t' );

			return {
				code: code,
				map: null
			};

		}

	};

}


function header() {

	return {

		renderChunk( code ) {

			return `/**
 * @license
 * Copyright 2010-2021 Neo.js Authors
 * SPDX-License-Identifier: MIT
 */
${ code }`;

		}

	};

}



const babelrc = {
	presets: [
		[
			'@babel/preset-env',
			{
				modules: false,
				targets: '>1%',
				loose: true,
				bugfixes: true,
			}
		]
	],
	plugins: [
	    [
	        "@babel/plugin-proposal-class-properties",
	        {
	        	"loose": true
	        }
	    ]
	]
};

export default [
    {
		input: 'src/Neo.js',
		plugins: [
			header()
		],
		output: [
			{
				format: 'esm',
				file: 'build/neo.module.js'
			}
		]
	},
	{
		input: 'src/Neo.js',
		plugins: [
			babel( {
				babelHelpers: 'bundled',
				compact: false,
				babelrc: false,
				...babelrc
			} ),
			babelCleanup(),
			header()
		],
		output: [
			{
				format: 'umd',
				name: 'NEO',
				file: 'build/neo.js',
				indent: '\t'
			}
		]
	},
	{
		input: 'src/Neo.js',
		plugins: [
			babel( {
				babelHelpers: 'bundled',
				babelrc: false,
				...babelrc
			} ),
			babelCleanup(),
			terser(),
			header()
		],
		output: [
			{
				format: 'umd',
				name: 'NEO',
				file: 'build/neo.min.js'
			}
		]
	}
	
];