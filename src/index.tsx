import { createRoot } from 'react-dom/client';
import { StrictMode, CSSProperties, useState } from 'react';
import clsx from 'clsx';

import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import { defaultArticleState } from './constants/articleProps'; // ← Убираем ArticleStateType

import './styles/index.scss';
import styles from './styles/index.module.scss';

const domNode = document.getElementById('root') as HTMLDivElement;
const root = createRoot(domNode);

const App = () => {
	// СОЗДАЕМ СОСТОЯНИЕ ДЛЯ ТЕКУЩИХ НАСТРОЕК СТАТЬИ
	// Начальное значение - настройки по умолчанию
	const [articleState, setArticleState] = useState(defaultArticleState);

	return (
		<main
			className={clsx(styles.main)}
			style={
				{
					// ПЕРЕДАЕМ НАСТРОЙКИ В CSS-ПЕРЕМЕННЫЕ
					// Эти переменные используются в стилях статьи
					'--font-family': articleState.fontFamilyOption.value,
					'--font-size': articleState.fontSizeOption.value,
					'--font-color': articleState.fontColor.value,
					'--container-width': articleState.contentWidth.value,
					'--bg-color': articleState.backgroundColor.value,
				} as CSSProperties
			}>
			{/* ПЕРЕДАЕМ ПРОПСЫ В ФОРМУ */}
			<ArticleParamsForm
				currentState={articleState} // Текущие настройки статьи
				onApply={setArticleState} // Функция для применения новых настроек
				onReset={() => setArticleState(defaultArticleState)} // Функция для сброса
			/>
			<Article />
		</main>
	);
};

root.render(
	<StrictMode>
		<App />
	</StrictMode>
);
