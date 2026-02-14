import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import styles from './ArticleParamsForm.module.scss';
import { useRef, useState } from 'react';
import clsx from 'clsx';
import {
	ArticleStateType,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
	OptionType,
} from 'src/constants/articleProps';
import { useOutsideClickClose } from 'src/ui/select/hooks/useOutsideClickClose';
import { Text } from 'src/ui/text';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';

type ArticleParamsFormProps = {
	newArticleState: ArticleStateType;
	onReset: () => void;
	onApply: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	newArticleState,
	onReset,
	onApply,
}: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState(false); //открываем панель настроек
	const refSideBar = useRef<HTMLDivElement | null>(null); //отлеживаем клики вне панели настроек
	const [formState, setFormState] = useState<ArticleStateType>(newArticleState); //состояние формы
	//обработчик клика для открытия панели управления
	const handleSideBarOpen = () => {
		setIsOpen((isOpen) => !isOpen);
	};
	//В работе есть хук для закрытия панели настроек
	useOutsideClickClose({
		isOpen,
		rootRef: refSideBar,
		onClose: () => setIsOpen(false),
		onChange: setIsOpen,
	});
	//обработчик изменения настроек панели
	const handleChangeSideBarOptions = (
		fieldData: keyof ArticleStateType,
		value: OptionType
	) => {
		setFormState((state) => ({
			...state,
			[fieldData]: value,
		}));
	};
	//обработчик сброса настроек панели
	const handleResetSideBarOptions = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setFormState(defaultArticleState);
		onReset();
	};
	//обработчик применения настроек, выбранных в панели
	const handleApplySideBarOptions = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onApply(formState);
		setIsOpen(false);
	};

	return (
		<>
			<ArrowButton isOpen={false} onClick={handleSideBarOpen} />
			<aside
				ref={refSideBar}
				className={clsx(styles.container, { [styles.container_open]: isOpen })}>
				<form
					//действия принять или сбросить надо повесить на форму
					className={styles.form}
					onReset={handleResetSideBarOptions}
					onSubmit={handleApplySideBarOptions}>
					{/* в форму необходимо добавить поля */}
					<Text size={31} weight={800} uppercase>
						задайте параметры
					</Text>

					<Select
						title='Шрифт'
						options={fontFamilyOptions}
						selected={formState.fontFamilyOption}
						onChange={(value) =>
							handleChangeSideBarOptions('fontFamilyOption', value)
						}
					/>

					<RadioGroup
						title='Размер шрифта'
						name='font-size'
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={(value) =>
							handleChangeSideBarOptions('fontSizeOption', value)
						}
					/>

					<Select
						title='Цвет шрифта'
						options={fontColors}
						selected={formState.fontColor}
						onChange={(value) => handleChangeSideBarOptions('fontColor', value)}
					/>

					<Separator />

					<Select
						title='Цвет фона'
						options={backgroundColors}
						selected={formState.backgroundColor}
						onChange={(value) =>
							handleChangeSideBarOptions('backgroundColor', value)
						}
					/>

					<Select
						title='Ширина контента'
						options={contentWidthArr}
						selected={formState.contentWidth}
						onChange={(value) =>
							handleChangeSideBarOptions('contentWidth', value)
						}
					/>

					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
