import { useState, useRef } from 'react';
import clsx from 'clsx';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import {
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	defaultArticleState, // ← импортируем дефолтные настройки
} from 'src/constants/articleProps';
import styles from './ArticleParamsForm.module.scss';
import { useOutsideClickClose } from 'src/ui/select/hooks/useOutsideClickClose';

// 1. ОПРЕДЕЛЯЕМ ТИП ПРОПСОВ ДЛЯ КОМПОНЕНТА ФОРМЫ
type ArticleParamsFormProps = {
	currentState: typeof defaultArticleState; // Текущие настройки статьи
	onApply: (newState: typeof defaultArticleState) => void; // Функция применения настроек
	onReset: () => void; // Функция сброса настроек
};

export const ArticleParamsForm = ({
	currentState,
	onApply,
	onReset,
}: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const sidebarRef = useRef<HTMLDivElement>(null);

	// 2. СОЗДАЕМ СОСТОЯНИЯ ДЛЯ КАЖДОЙ НАСТРОЙКИ ФОРМЫ
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

	// 3. СОЗДАЕМ ОБРАБОТЧИК ДЛЯ КНОПКИ "ПРИМЕНИТЬ"
	const handleApply = (e: React.FormEvent) => {
		e.preventDefault(); // Предотвращаем стандартное поведение формы

		// 4. СОБИРАЕМ ВСЕ ВЫБРАННЫЕ НАСТРОЙКИ В ОДИН ОБЪЕКТ
		const newSettings = {
			fontFamilyOption: selectedFont,
			fontSizeOption: selectedFontSize,
			fontColor: selectedFontColor,
			backgroundColor: selectedBackgroundColor,
			contentWidth: selectedContentWidth,
		};

		// 5. ПЕРЕДАЕМ НОВЫЕ НАСТРОЙКИ В РОДИТЕЛЬСКИЙ КОМПОНЕНТ (App)
		onApply(newSettings);
	};

	// 6. СОЗДАЕМ ОБРАБОТЧИК ДЛЯ КНОПКИ "СБРОСИТЬ"
	const handleReset = () => {
		// 7. СБРАСЫВАЕМ ВСЕ СОСТОЯНИЯ ФОРМЫ К ЗНАЧЕНИЯМ ПО УМОЛЧАНИЮ
		setSelectedFont(defaultArticleState.fontFamilyOption);
		setSelectedFontSize(defaultArticleState.fontSizeOption);
		setSelectedFontColor(defaultArticleState.fontColor);
		setSelectedBackgroundColor(defaultArticleState.backgroundColor);
		setSelectedContentWidth(defaultArticleState.contentWidth);

		// 8. ВЫЗЫВАЕМ ФУНКЦИЮ СБРОСА ИЗ РОДИТЕЛЬСКОГО КОМПОНЕНТА
		onReset();
	};

	// 9. ИСПОЛЬЗУЕМ ХУК ДЛЯ ЗАКРЫТИЯ ФОРМЫ ПО КЛИКУ ВНЕ ЕЕ
	useOutsideClickClose({
		isOpen,
		rootRef: sidebarRef,
		onClose: () => setIsOpen(false),
		onChange: setIsOpen,
	});

	return (
		<div ref={sidebarRef}>
			{/* 10. КНОПКА-СТРЕЛКА ДЛЯ ОТКРЫТИЯ/ЗАКРЫТИЯ ФОРМЫ */}
			<ArrowButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />

			{/* 11. БОКОВАЯ ПАНЕЛЬ С ФОРМОЙ НАСТРОЕК */}
			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isOpen, // Динамически применяем класс для анимации
				})}>
				{/* 12. ФОРМА С ОБРАБОТЧИКАМИ СОБЫТИЙ */}
				<form
					className={styles.form}
					onSubmit={handleApply}
					onReset={handleReset}>
					{/* 13. ВЫБОР ШРИФТА */}
					<Select
						title='Шрифт'
						options={fontFamilyOptions}
						selected={selectedFont}
						onChange={setSelectedFont}
					/>

					<Separator />

					{/* 14. ВЫБОР РАЗМЕРА ШРИФТА */}
					<RadioGroup
						title='Размер шрифта'
						name='fontSize'
						options={fontSizeOptions}
						selected={selectedFontSize}
						onChange={setSelectedFontSize}
					/>

					<Separator />

					{/* 15. ВЫБОР ЦВЕТА ТЕКСТА */}
					<Select
						title='Цвет шрифта'
						options={fontColors}
						selected={selectedFontColor}
						onChange={setSelectedFontColor}
					/>

					<Separator />

					{/* 16. ВЫБОР ЦВЕТА ФОНА */}
					<Select
						title='Цвет фона'
						options={backgroundColors}
						selected={selectedBackgroundColor}
						onChange={setSelectedBackgroundColor}
					/>

					<Separator />

					{/* 17. ВЫБОР ШИРИНЫ КОНТЕНТА */}
					<Select
						title='Ширина контента'
						options={contentWidthArr}
						selected={selectedContentWidth}
						onChange={setSelectedContentWidth}
					/>

					<Separator />

					{/* 18. КОНТЕЙНЕР С КНОПКАМИ ВНИЗУ ФОРМЫ */}
					<div className={styles.bottomContainer}>
						{/* 19. КНОПКА "СБРОСИТЬ" - СБРАСЫВАЕТ НАСТРОЙКИ */}
						<Button title='Сбросить' htmlType='reset' type='clear' />
						{/* 20. КНОПКА "ПРИМЕНИТЬ" - СОХРАНЯЕТ НАСТРОЙКИ */}
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</div>
	);
};
