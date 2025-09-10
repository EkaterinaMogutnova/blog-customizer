// Импортируем необходимые инструменты из React
import { useState, useRef } from 'react';
// Библиотека для удобной работы с CSS-классами
import clsx from 'clsx';

// Импортируем все нужные компоненты из нашей библиотеки
import { ArrowButton } from 'src/ui/arrow-button'; // Кнопка-стрелка для открытия/закрытия
import { Button } from 'src/ui/button'; // Кнопки "Применить" и "Сбросить"
import { Select } from 'src/ui/select'; // Выпадающие списки для выбора
import { RadioGroup } from 'src/ui/radio-group'; // Группы переключателей

import { Text } from 'src/ui/text'; // Компонент для текста с разными стилями

// Импортируем все возможные варианты настроек из констант
import {
	fontFamilyOptions, // Все доступные шрифты
	fontSizeOptions, // Все доступные размеры текста
	fontColors, // Все доступные цвета текста
	backgroundColors, // Все доступные цвета фона
	contentWidthArr, // Все доступные ширины контента
	defaultArticleState, // Настройки по умолчанию
} from 'src/constants/articleProps';

// Импортируем стили именно для этого компонента формы
import styles from './ArticleParamsForm.module.scss';

// Импортируем специальный хук для закрытия формы по клику вне её области
import { useOutsideClickClose } from 'src/ui/select/hooks/useOutsideClickClose';

// Описываем какие данные нужно передать в этот компонент (пропсы)
type ArticleParamsFormProps = {
	currentState: typeof defaultArticleState; // Текущие настройки статьи (из главного компонента)
	onApply: (newState: typeof defaultArticleState) => void; // Функция для сохранения новых настроек
	onReset: () => void; // Функция для сброса к настройкам по умолчанию
};

// Основной компонент формы настроек статьи
export const ArticleParamsForm = ({
	currentState, // Получаем текущие настройки статьи
	onApply, // Получаем функцию для применения настроек
	onReset, // Получаем функцию для сброса настроек
}: ArticleParamsFormProps) => {
	// Состояние для отслеживания открыта ли форма настроек
	const [isOpen, setIsOpen] = useState(false);

	// Создаем ссылку на DOM-элемент формы для отслеживания кликов вне формы
	const sidebarRef = useRef<HTMLDivElement>(null);

	// Создаем отдельные состояния для каждой настройки в форме
	// Это нужно чтобы изменения в форме не сразу применялись к статье
	// Используем currentState для начальных значений
	const [selectedFont, setSelectedFont] = useState(
		currentState.fontFamilyOption
	);
	const [selectedFontSize, setSelectedFontSize] = useState(
		currentState.fontSizeOption
	);
	const [selectedFontColor, setSelectedFontColor] = useState(
		currentState.fontColor
	);
	const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(
		currentState.backgroundColor
	);
	const [selectedContentWidth, setSelectedContentWidth] = useState(
		currentState.contentWidth
	);

	// Обработчик для кнопки "Применить"
	const handleApply = (e: React.FormEvent) => {
		e.preventDefault(); // Предотвращаем стандартное поведение формы (перезагрузку страницы)

		// Собираем все выбранные настройки в один объект
		const newSettings = {
			fontFamilyOption: selectedFont,
			fontSizeOption: selectedFontSize,
			fontColor: selectedFontColor,
			backgroundColor: selectedBackgroundColor,
			contentWidth: selectedContentWidth,
		};

		// Передаем новые настройки в главный компонент (App)
		onApply(newSettings);
	};

	// Обработчик для кнопки "Сбросить"
	const handleReset = () => {
		// Возвращаем все настройки в форме к значениям по умолчанию
		setSelectedFont(defaultArticleState.fontFamilyOption);
		setSelectedFontSize(defaultArticleState.fontSizeOption);
		setSelectedFontColor(defaultArticleState.fontColor);
		setSelectedBackgroundColor(defaultArticleState.backgroundColor);
		setSelectedContentWidth(defaultArticleState.contentWidth);

		// Вызываем функцию сброса в главном компоненте
		onReset();
	};

	// Используем хук для закрытия формы когда пользователь кликает вне её области
	useOutsideClickClose({
		isOpen, // Передаем текущее состояние открытия формы
		rootRef: sidebarRef, // Передаем ссылку на элемент формы
		onClose: () => setIsOpen(false), // Функция для закрытия формы
		onChange: setIsOpen, // Функция для изменения состояния открытия
	});

	// Возвращаем JSX разметку компонента
	return (
		<div ref={sidebarRef}>
			<ArrowButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />

			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleApply}
					onReset={handleReset}>
					{/* Заголовок формы */}
					<div className={styles.formTitle}>
						<Text as='h2' size={31} weight={800} uppercase align='center'>
							Задайте параметры
						</Text>
					</div>

					{/* Выбор шрифта */}
					<div className={styles.formItem}>
						<Select
							title='Шрифт'
							options={fontFamilyOptions}
							selected={selectedFont}
							onChange={setSelectedFont}
						/>
					</div>

					{/* Выбор размера шрифта */}
					<div className={styles.formItem}>
						<RadioGroup
							title='Размер шрифта'
							name='fontSize'
							options={fontSizeOptions}
							selected={selectedFontSize}
							onChange={setSelectedFontSize}
						/>
					</div>

					{/* Выбор цвета текста */}
					<div className={styles.formItem}>
						<Select
							title='Цвет шрифта'
							options={fontColors}
							selected={selectedFontColor}
							onChange={setSelectedFontColor}
						/>
					</div>

					{/* Выбор цвета фона */}
					<div className={styles.formItem}>
						<Select
							title='Цвет фона'
							options={backgroundColors}
							selected={selectedBackgroundColor}
							onChange={setSelectedBackgroundColor}
						/>
					</div>

					{/* Выбор ширины контента */}
					<div className={styles.formItem}>
						<Select
							title='Ширина контента'
							options={contentWidthArr}
							selected={selectedContentWidth}
							onChange={setSelectedContentWidth}
						/>
					</div>

					{/* Контейнер для кнопок внизу формы */}
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</div>
	);
};
