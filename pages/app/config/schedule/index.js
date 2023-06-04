import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import React, { useEffect, useRef, useState } from 'react';

const Crud = () => {
    let emptyProduct = {
        id: null,
        name: '',
        image: null,
        description: '',
        category: null,
        price: 0,
        quantity: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK'
    };
    const cities = [
        { name: 'Segundos', id: 1 },
        { name: 'Minutos', id: 1 },
        { name: 'Horas', id: 1 }
    ];
    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    useEffect(() => {
        //const productService = new ProductService();
        //productService.getProducts().then((data) => setProducts(data));
        let data = [{
            id: 1,
            name: 'Horario de Mañana',
            days: {
                monday: {
                    schedule: [
                        {
                            entry: "08:00",
                            exit: "12:00"
                        }
                    ]
                },
                tuesday: null,
                wednesday: null,
                thursday: null,
                friday: null,
                saturday: null,
                sunday: null
            },
            tolerance: '5 minutos'
        },
        {
            id: 2,
            name: 'Horario de Tarde',
            days: {
                monday: {
                    schedule: [
                        {
                            entry: "13:00",
                            exit: "18:00"
                        }
                    ]
                },
                tuesday: null,
                wednesday: null,
                thursday: null,
                friday: null,
                saturday: null,
                sunday: null
            },
            tolerance: '5 minutos'
        },
        {
            id: 1,
            name: 'Horario Fulltime',
            days: {
                monday: {
                    schedule: [
                        {
                            entry: "08:00",
                            exit: "12:00"
                        },
                        {
                            entry: "13:00",
                            exit: "18:00"
                        }
                    ]
                },
                tuesday: null,
                wednesday: null,
                thursday: null,
                friday: null,
                saturday: null,
                sunday: null
            },
            tolerance: '5 minutos'
        }
    ]
        setProducts(data)
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (product.name.trim()) {
            let _products = [...products];
            let _product = { ...product };
            if (product.id) {
                const index = findIndexById(product.id);

                _products[index] = _product;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                _product.id = createId();
                _product.code = createId();
                _product.image = 'product-placeholder.svg';
                _products.push(_product);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            setProducts(_products);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = products.filter((val) => val.id !== product.id);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = products.filter((val) => !selectedProducts.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };

    const onCategoryChange = (e) => {
        let _product = { ...product };
        _product['category'] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const mondayBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {
                    rowData.days.monday? rowData.days.monday.schedule.map(x=>{
                        return <>{`Entrada: ${x.entry} - Salida ${x.exit}`} <br/></>
                    }): '-'
                }
            </>
        );
    };

    const tuesdayBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {
                    rowData.days.tuesday? rowData.days.tuesday.schedule.map(x=>{
                        return <>{`Entrada: ${x.entry} - Salida ${x.exit}`} <br/></>
                    }): '-'
                }
            </>
        );
    };

    const wednesdayBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {
                    rowData.days.wednesday? rowData.days.wednesday.schedule.map(x=>{
                        return <>{`Entrada: ${x.entry} - Salida ${x.exit}`} <br/></>
                    }): '-'
                }
            </>
        );
    };

    const thursdayBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {
                    rowData.days.thursday? rowData.days.thursday.schedule.map(x=>{
                        return <>{`Entrada: ${x.entry} - Salida ${x.exit}`} <br/></>
                    }): '-'
                }
            </>
        );
    };

    const fridayBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {
                    rowData.days.friday? rowData.days.friday.schedule.map(x=>{
                        return <>{`Entrada: ${x.entry} - Salida ${x.exit}`} <br/></>
                    }): '-'
                }
            </>
        );
    };

    const saturdayBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {
                    rowData.days.saturday? rowData.days.saturday.schedule.map(x=>{
                        return <>{`Entrada: ${x.entry} - Salida ${x.exit}`} <br/></>
                    }): '-'
                }
            </>
        );
    };

    const sundayBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {
                    rowData.days.sunday? rowData.days.sunday.schedule.map(x=>{
                        return <>{`Entrada: ${x.entry} - Salida ${x.exit}`} <br/></>
                    }): '-'
                }
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Listado de Horarios</h5>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={products}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} horarios"
                        globalFilter={globalFilter}
                        emptyMessage="No products found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column field="id" header="ID" sortable headerStyle={{ minWidth: '2rem' }}></Column>
                        <Column field="name" header="Horario" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="tolerance" header="Tolerancia" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Lunes" sortable body={mondayBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Martes" sortable body={tuesdayBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Miercoles" sortable body={wednesdayBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Jueves" sortable body={thursdayBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Viernes" sortable body={fridayBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Sabado" sortable body={saturdayBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Domingo" sortable body={sundayBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Detalles de horario" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Turno Horario</label>
                            <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                            {submitted && !product.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <label htmlFor="price">Tolerancia:</label>
                        <br/>
                        <br/>
                        <div className="formgrid grid">
                            <div className="field col">
                                <InputNumber id="quantity" value={product.num_tolerance} onValueChange={(e) => onInputNumberChange(e, 'num_tolerance')} integeronly />
                            </div>
                            <div className="field col">
                            <Dropdown value={product.unit_tolerance} onChange={(e) => onInputChange(e, 'unit_tolerance')} options={cities} optionLabel="name" 
                    placeholder="Seleccione una unidad" />
                            </div>
                        </div>
                        <label htmlFor="price">Lunes:</label>
                        <br/>
                        <br/>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Entrada</label>
                                <Calendar value={product.monday_entry} onValueChange={(e) => onInputNumberChange(e, 'monday_entry')} timeOnly />
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Salida</label>
                                <Calendar value={product.monday_exit} onValueChange={(e) => onInputNumberChange(e, 'monday_exit')} timeOnly />
                            </div>
                        </div>
                        <label htmlFor="price">Martes:</label>
                        <br/>
                        <br/>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Entrada</label>
                                <Calendar value={product.tuesday_entry} onValueChange={(e) => onInputNumberChange(e, 'tuesday_entry')} timeOnly />
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Salida</label>
                                <Calendar value={product.tuesday_exit} onValueChange={(e) => onInputNumberChange(e, 'tuesday_exit')} timeOnly />
                            </div>
                        </div>
                        <label htmlFor="price">Miercoles:</label>
                        <br/>
                        <br/>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Entrada</label>
                                <Calendar value={product.wednesday_entry} onValueChange={(e) => onInputNumberChange(e, 'wednesday_entry')} timeOnly />
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Salida</label>
                                <Calendar value={product.wednesday_exit} onValueChange={(e) => onInputNumberChange(e, 'wednesday_exit')} timeOnly />
                            </div>
                        </div>
                        <label htmlFor="price">Jueves:</label>
                        <br/>
                        <br/>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Entrada</label>
                                <Calendar value={product.thursday_entry} onValueChange={(e) => onInputNumberChange(e, 'thursday_entry')} timeOnly />
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Salida</label>
                                <Calendar value={product.thursday_exit} onValueChange={(e) => onInputNumberChange(e, 'thursday_exit')} timeOnly />
                            </div>
                        </div>
                        <label htmlFor="price">Viernes:</label>
                        <br/>
                        <br/>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Entrada</label>
                                <Calendar value={product.friday_entry} onValueChange={(e) => onInputNumberChange(e, 'friday_entry')} timeOnly />
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Salida</label>
                                <Calendar value={product.friday_exit} onValueChange={(e) => onInputNumberChange(e, 'friday_exit')} timeOnly />
                            </div>
                        </div>
                        <label htmlFor="price">Sabado:</label>
                        <br/>
                        <br/>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Entrada</label>
                                <Calendar value={product.saturday_entry} onValueChange={(e) => onInputNumberChange(e, 'saturday_entry')} timeOnly />
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Salida</label>
                                <Calendar value={product.saturday_exit} onValueChange={(e) => onInputNumberChange(e, 'saturday_exit')} timeOnly />
                            </div>
                        </div>
                        <label htmlFor="price">Domingo:</label>
                        <br/>
                        <br/>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Entrada</label>
                                <Calendar value={product.sunday_entry} onValueChange={(e) => onInputNumberChange(e, 'sunday_entry')} timeOnly />
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Salida</label>
                                <Calendar value={product.sunday_exit} onValueChange={(e) => onInputNumberChange(e, 'sunday_exit')} timeOnly />
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    ¿Seguro que desea eliminar el horario <b>{product.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
