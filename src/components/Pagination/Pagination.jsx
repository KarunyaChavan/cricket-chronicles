import { useTranslation } from 'react-i18next'
import './Pagination.css'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
	const { t } = useTranslation()

	if (totalPages <= 1) return <></>

	return (
		<nav className="pagination" aria-label="Pagination">
			<button
				className="pagination__button"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				aria-label={t('pagination.previous')}
			>
				{t('pagination.previous')}
			</button>

			<span className="pagination__info">
				{t('pagination.page', { current: currentPage, total: totalPages })}
			</span>

			<button
				className="pagination__button"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				aria-label={t('pagination.next')}
			>
				{t('pagination.next')}
			</button>
		</nav>
	)
}

export default Pagination
