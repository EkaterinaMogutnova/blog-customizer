import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

import { ArrowButton } from 'src/ui/arrow-button'; // Кнопка-стрелка для открытия/закрытия
import { Button } from 'src/ui/button'; // Кнопки "Применить" и "Сбросить"
import { Select } from 'src/ui/select'; // Выпадающие списки для выбора
import { RadioGroup } from 'src/ui/radio-group'; // Группы переключателей
import { Separator } from 'src/ui/separator'; //Полоска
import { Text } from 'src/ui/text'; // Компонент для текста с разными стилями

// Импортируем из констант
import {
	fontFamilyOptions, // Все доступные шрифты
	fontSizeOptions, // Все доступные размеры текста
	fontColors, // Все доступные цвета текста
	backgroundColors, // Все доступные цвета фона
	contentWidthArr, // Все доступные ширины контента
	defaultArticleState, // Настройки по умолчанию
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

// Интерфейс для хука использования клика вне области
interface UseOutsideClickClose {
	isOpen: boolean;
	rootRef: React.RefObject<HTMLElement>;
	onClose: () => void;
	onChange?: (isOpen: boolean) => void;
}

// Исправленный хук для закрытия формы по клику вне её области
const useOutsideClickClose = ({
	isOpen,
	rootRef,
	onClose,
	onChange,
}: UseOutsideClickClose) => {
	useEffect(() => {
		if (!isOpen) {
			return; // Не добавляем обработчик, если форма закрыта
		}

		const handleClick = (event: MouseEvent) => {
			const { target } = event;

			// Проверяем, что клик был вне элемента формы
			if (target instanceof Node && !rootRef.current?.contains(target)) {
				onClose();
				onChange?.(false);
			}
		};

		// Добавляем обработчик события
		document.addEventListener('mousedown', handleClick);

		// Убираем обработчик при размонтировании или изменении isOpen
		return () => {
			document.removeEventListener('mousedown', handleClick);
		};
	}, [isOpen, rootRef, onClose, onChange]); // Зависимости для эффекта
};

// Описываем какие данные нужно передать в этот компонент
type ArticleParamsFormProps = {
	currentState: typeof defaultArticleState; // Текущие настройки статьи
	onApply: (newState: typeof defaultArticleState) => void; // Функция для сохранения новых настроек
	onReset: () => void; // Функция для сброса к настройкам по умолчанию
};

// Основной компонент формы настроек статьи
export const ArticleParamsForm = ({
	currentState, // Получаем текущие настройки статьи
	onApply,
	onReset,
}: ArticleParamsFormProps) => {
	// Состояние для отслеживания открыта ли форма настроек
	// isOpen на isFormOpen
	const [isFormOpen, setIsFormOpen] = useState(false);

	// Для отслеживания кликов вне формы
	const sidebarRef = useRef<HTMLDivElement>(null);

	// Создаем отдельные состояния для каждой настройки в форме

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
		e.preventDefault();

		// Собираем все выбранные настройки в один объект
		const newSettings = {
			fontFamilyOption: selectedFont,
			fontSizeOption: selectedFontSize,
			fontColor: selectedFontColor,
			backgroundColor: selectedBackgroundColor,
			contentWidth: selectedContentWidth,
		};

		// Передаем новые настройки в главный компонент
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

	// Используем хук для закрытия формы вне её области
	useOutsideClickClose({
		isOpen: isFormOpen, // Передаем текущее состояние открытия формы
		rootRef: sidebarRef, // Передаем ссылку на элемент формы
		onClose: () => setIsFormOpen(false),
		onChange: setIsFormOpen,
	});

	// Возвращаем JSX разметку компонента
	return (
		<div ref={sidebarRef}>
			{/* isOpen на isFormOpen */}
			<ArrowButton
				isOpen={isFormOpen}
				onClick={() => setIsFormOpen(!isFormOpen)}
			/>

			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isFormOpen,
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
					<div className={styles.formItem}>
						<Separator />
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
