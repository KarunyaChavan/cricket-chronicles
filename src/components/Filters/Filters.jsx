import { useTranslation } from 'react-i18next'
import './Filters.css'

const Filters = ({ searchQuery, onSearchChange, onSearchSubmit, sortBy, onSortChange }) => {
	const { t } = useTranslation()

	return (
		<div className="filters">
			<div className="filters__group">
				<label htmlFor="search" className="sr-only">
					Search
				</label>
				<input
					id="search"
					type="search"
					className="filters__input filters__input--search"
					placeholder={t('players.searchHolder')}
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault()
							if (onSearchSubmit) onSearchSubmit(e.target.value)
						}
					}}
				/>
			</div>

			<div className="filters__group">
				<label htmlFor="sort" className="sr-only">
					{t('players.sort.label')}
				</label>
				<select
					id="sort"
					className="filters__input filters__input--select"
					value={sortBy}
					onChange={(e) => onSortChange(e.target.value)}
				>
					<option value="firstNameAsc">{t('players.sort.firstNameAsc')}</option>
					<option value="firstNameDesc">{t('players.sort.firstNameDesc')}</option>
					<option value="idAsc">{t('players.sort.idAsc')}</option>
					<option value="idDesc">{t('players.sort.idDesc')}</option>
				</select>
			</div>
		</div>
	)
}

export default Filters
