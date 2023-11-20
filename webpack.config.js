const path = require('path') // Импортируем модуль "path" для работы с путями файлов
const HtmlWebpackPlugin = require('html-webpack-plugin') // Подключаем плагин, генерирующий HTML

module.exports = {
    entry: './static/index.ts', // Точка входа для сборки проекта
    module: {
        rules: [ 
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            // Регулярное выражение для обработки images 
            // type -> файлы будут складываться в директорию с бандлом
            {
                test: /\.(png|jpg |jpeg|gif)$/i,
                type: 'asset/resource',
            },
            // Регулярное выражение для обработки css файлов 
            // и загрузчики для обработки css файлов
            { 
                test: /\.css$/, 
                use: ['style-loader','css-loader'] 
            }, 

        ], 
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'static', 'dist'), // Путь для выходного файла сборки
        filename: 'bundle.[contenthash].js', // Имя выходного файла сборки 
    },  

    plugins: [
        // Используем плагин, автоматически генерирующий HTML-файл
        new HtmlWebpackPlugin({
            template: './static/index.html' 
        }),
    ],

    mode: 'development' // минификация кода и удаление комментариев для уменьшения размера бандла
}
