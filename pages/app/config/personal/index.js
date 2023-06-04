import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import {Dropdown} from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';

const Crud = () => {
    let emptyProduct = {
        id: null,
        dni: '',
        name: '',
        surname: '',
        schedule: null,
        email: '',
        phone: '',
        role: {
            id: null,
            name: ''
        }
    };

const dropdownValu = [
    { name: 'Turno Mañana', code: 'TM' },
    { name: 'Turno Tarde', code: 'TT' },
    { name: 'Turno Noche', code: 'TN' },
    { name: 'Turno Madrugada', code: 'TMA' }
]
    
    const [products, setProducts] = useState([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [dropdownValue, setDropdownValue] = useState(null);
    const [dropdownValues, setDropdownValues] = useState([
        { name: 'Administrador', code: 'AD' },
        { name: 'Secretario', code: 'SE' },
        { name: 'Contador', code: 'CO' },
        { name: 'Diseñador', code: 'DI' },
        { name: 'Programador', code: 'PRO' }
    ]);
    const [product, setProduct] = useState(emptyProduct);
    const [loading, setLoading] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    useEffect(() => {
        setLoading(true)
        async function fetchData() {
            try {
                const response = await fetch('/api/personal');
                const data = await response.json();
                console.log(data)
                setProducts(data)
            } catch (error) {
                console.error('Error:', error);
            }
            setLoading(false)
        }
        fetchData();
    }, []);

    const openNew = async () => {
        setProduct(emptyProduct);
        try {
            const response = await fetch('/api/role');
            const data = await response.json();
            setDropdownValues(data)
        } catch (error) {
            console.error('Error:', error);
        }
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

    const saveProduct = async () => {
        setSubmitted(true);

        if (product.name.trim()) {
            let _product = { ...product };
            let _products = [... products]
            if (product.id) {
                const response = await (await fetch(`/api/personal/${product.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: product.name
                }),
                    })).json();
                const index = findIndexById(response.id);

                _products[index] = response;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Personal Actualizado', life: 3000 });
            } else {
                let schedule = {...product}.schedule.name;
                let role = {...product}.role.id
                delete product.schedule
                delete product.role
                delete product.id
                const response = await (await fetch("/api/personal", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({...product, schedule, role}),
                    })).json(); 
                _products.push(response);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Personal Creado', life: 3000 });
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

    const deleteProduct = async () => {
        const response = await (await fetch(`/api/personal/${product.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            })).json();
        
        let _products = products.filter((val) => val.id !== response.id);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Personal Eliminado', life: 3000 });
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
            <h5 className="m-0">Personal</h5>
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
                        loading={loading}
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} registros de personal"
                        globalFilter={globalFilter}
                        emptyMessage="No personal found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column field="id" header="ID" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="dni" header="D.N.I." sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Nombres" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="surname" header="Apellidos" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="schedule" header="Horario" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="email" header="Correo Electronico" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="phone" header="Numero Telefonico" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="role.name" header="Cargo" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Detalles del Personal" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="dni">D.N.I.</label>
                            <InputText id="dni" value={product.dni} onChange={(e) => onInputChange(e, 'dni')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.dni })} />
                            {submitted && !product.dni && <small className="p-invalid">El D.N.I es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Nombres</label>
                            <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                            {submitted && !product.name && <small className="p-invalid">El nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Apellidos</label>
                            <InputText id="name" value={product.surname} onChange={(e) => onInputChange(e, 'surname')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.surname })} />
                            {submitted && !product.surname && <small className="p-invalid">El Apellido es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Horario</label>
                            <Dropdown id="name" value={product.schedule} onChange={(e) => onInputChange(e, 'schedule')} options={dropdownValu} optionLabel="name" placeholder="Select" className={classNames({ 'p-invalid': submitted && !product.name })}/>
                            {submitted && !product.name && <small className="p-invalid">El Horario es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Correo Electronico</label>
                            <InputText id="name" value={product.email} onChange={(e) => onInputChange(e, 'email')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.email })} />
                            {submitted && !product.name && <small className="p-invalid">El correo es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Numero Telefonico</label>
                            <InputText id="name" value={product.phone} onChange={(e) => onInputChange(e, 'phone')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                            {submitted && !product.name && <small className="p-invalid">El telefono es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Cargo</label>
                            <Dropdown id="name" value={product.role} onChange={(e) => onInputChange(e, 'role')} options={dropdownValues} optionLabel="name" placeholder="Select" className={classNames({ 'p-invalid': submitted && !product.name })}/>
                            {submitted && !product.name && <small className="p-invalid">El cargo es requerido.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    ¿Seguro que desea eliminar al personal <b>{product.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Estas seguro de eliminar a los empleados seleccionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
