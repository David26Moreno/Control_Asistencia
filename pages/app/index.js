import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ProductService } from '../../demo/service/ProductService';
import { LayoutContext } from '../../layout/context/layoutcontext';
import Link from 'next/link';
const lineData = {
    labels: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
    datasets: [
        {
            label: 'Asistencias',
            data: [7,2,9, 7, 7, 6, 7, 5, 4],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'Inasistencias',
            data: [2,8,0, 0, 0, 1, 0, 2, 3],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
};

const Dashboard = () => {
    const [products, setProducts] = useState(null);
    const menu1 = useRef(null);
    const menu2 = useRef(null);
    const [lineOptions, setLineOptions] = useState(null);
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const applyLightTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    useEffect(() => {
        const productService = new ProductService();
        productService.getProductsSmall().then((data) => setProducts(data));
    }, []);

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Personal</span>
                            <div className="text-900 font-medium text-xl">1</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-user text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">1 nuevo </span>
                    <span className="text-500">registrado</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Registros</span>
                            <div className="text-900 font-medium text-xl">2</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-check text-orange-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">2 nuevos </span>
                    <span className="text-500">registros de asistencia en el día</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Horarios</span>
                            <div className="text-900 font-medium text-xl">3</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-calendar text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">3 </span>
                    <span className="text-500">registrados recientemente</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Eventos</span>
                            <div className="text-900 font-medium text-xl">4</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-comment text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">4 </span>
                    <span className="text-500">Eventos ocurridos</span>
                </div>
            </div>

            <div className="col-12 xl:col-6">
            <div className="card">
                    <div className="flex align-items-center justify-content-between mb-4">
                        <h5>Notificaciones</h5>
                    </div>

                    <span className="block text-600 font-medium mb-3">HOY</span>
                    <ul className="p-0 mx-0 mt-0 mb-4 list-none">
                        <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-user text-xl text-blue-500" />
                            </div>
                            <span className="text-900 line-height-3">
                                Francisco Raul Alvares Leyva 
                                <span className="text-700">
                                    {' '}
                                    Se ausento en el trabajo
                                </span>
                            </span>
                        </li>
                    </ul>
                    <span className="block text-600 font-medium mb-3">Ayer</span>
                    <ul className="p-0 mx-0 mt-0 mb-4 list-none">
                        <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-user text-xl text-blue-500" />
                            </div>
                            <span className="text-900 line-height-3">
                                David Moreno Antunez
                                <span className="text-700">
                                    {' '}
                                    Llego puntual al trabajo
                                </span>
                            </span>
                        </li>
                    </ul>

                </div>
                
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Asistencias vs Inasistencias</h5>
                    <Chart type="line" data={lineData} options={lineOptions} />
                </div>

                
                
            </div>
        </div>
    );
};

export default Dashboard;
