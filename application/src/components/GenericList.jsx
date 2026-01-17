import { useState, useEffect } from 'react';
import SearchFilter from './SearchFilter';
import Pagination from './Pagination';
import ConfirmDialog from './ConfirmDialog';
import GenericItem from './GenericItem';
import { useNotification } from './NotificationContext';

function GenericList({
    title,             
    items,              
    renderItem,         
    onDelete,
    onUpdate,
    onAdd,           
    onAddClick,         
    searchOptions,      
    onFilterChange,     
    itemsPerPage = 10,  
    children,
    useGrid = false,
    useGenericItem = false,
    itemName = 'פריט',
    renderView,
    renderEdit
}) {
    const { showNotification } = useNotification();
    const [searchBy, setSearchBy] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [deleteId, setDeleteId] = useState(null);

    const handleGenericAdd = async (data) => {
        if (onAdd) {
            const result = await onAdd(data);
            if (result?.success) {
                showNotification(`${itemName} נוסף בהצלחה`, 'success');
            } else {
                showNotification(`שגיאה בהוספת ${itemName}`, 'error');
            }
        }
    };

    useEffect(() => {
        if (onFilterChange) {
            onFilterChange({ searchBy, searchValue });
        }
        setCurrentPage(0);
    }, [searchBy, searchValue]);

    // הערה: אם רוצים פגינציה בצד שרת, יש לשנות את הלוגיקה כאן
    const startIndex = currentPage * itemsPerPage;
    const currentItems = items.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(items.length / itemsPerPage);

    const handleDeleteClick = (id) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            await onDelete(deleteId);
            setDeleteId(null);
        }
    };

    return (
        <div className="container">
            {deleteId && (
                <ConfirmDialog
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteId(null)}
                />
            )}

            <h2>{title}</h2>

            <div className="toolbar">
                {children}
                
                {searchOptions && (
                    <SearchFilter
                        searchOptions={searchOptions}
                        searchBy={searchBy}
                        setSearchBy={setSearchBy}
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                    />
                )}
                
                {onAddClick && (
                    <button onClick={onAddClick}>➕ הוסף חדש</button>
                )}
            </div>

            <div className={useGrid ? "grid" : "list"}>
                {currentItems.length > 0 ? (
                    currentItems.map((item) => (
                        <div key={item.id} className={useGrid ? "" : "list-item-wrapper"}>
                            {useGenericItem ? (
                                <GenericItem
                                    item={item}
                                    onDelete={onDelete}
                                    onUpdate={onUpdate}
                                    editableFields={['title']}
                                    displayFields={['id', 'title']}
                                    itemName={itemName}
                                    renderView={renderView}
                                    renderEdit={renderEdit}
                                />
                            ) : (
                                renderItem(item, () => handleDeleteClick(item.id))
                            )}
                        </div>
                    ))
                ) : (
                    <p>לא נמצאו פריטים</p>
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}

export default GenericList;