import React from 'react';
import './SupportView.css';

function SupportView() {
    return (
        <div id="index">
            <main>
                {/* Floating Contact Card */}
                <div className="card card-fijo collapse" id="collapseExample">
                    <div className="card-body card-body-flotante">
                        <div className="title-card-flotante">
                            <div className="row">
                                <div className="col-md-auto colphone">
                                    <img className="vendeonline" src="/img/vendedoronline.png" alt="Vendedor Online" />
                                </div>
                                <div className="col colphone">
                                    <span className="span-flotante flo-ne">Atención al Cliente</span><br />
                                    <span className="span-flotante flo-me">COMPUNET</span>
                                </div>
                            </div>
                        </div>
                        <div className="alert alert-flotante alert-light" role="alert">
                            <div className="row">
                                <div className="col coltexflo colphone">Aqui!! Sucursal Imperial 👋</div>
                                <div className="col-md-auto colphone">
                                    <a target="_blank" rel="noopener noreferrer" href="https://api.whatsapp.com/send?phone=51926052866&text=Hola,%20Quisiera%20consultar%20sobre%20el%20producto%20en%20venta">
                                        <img className="enviarflotante" src="/img/enviar.png" alt="Enviar" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="alert alert-flotante alert-light" role="alert">
                            <div className="row">
                                <div className="col coltexflo colphone">Aqui!! Sucursal San Vicente 👋</div>
                                <div className="col-md-auto colphone">
                                    <a target="_blank" rel="noopener noreferrer" href="https://api.whatsapp.com/send?phone=51928462723&text=Hola,%20Quisiera%20consultar%20sobre%20el%20producto%20en%20venta">
                                        <img className="enviarflotante" src="/img/enviar.png" alt="Enviar" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="alert alert-flotante alert-light" role="alert">
                            <div className="row">
                                <div className="col coltexflo colphone">Aqui!! Sucursal Mala 👋</div>
                                <div className="col-md-auto colphone">
                                    <a target="_blank" rel="noopener noreferrer" href="https://api.whatsapp.com/send?phone=51900186869&text=Hola,%20Quisiera%20consultar%20sobre%20el%20producto%20en%20venta">
                                        <img className="enviarflotante" src="/img/enviar.png" alt="Enviar" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audio Player */}
                <div className="ico-audio">
                    <span className="procompuau">&gt;&gt;&gt; PROMOCIONES COMPUNET &lt;&lt;&lt;</span>
                    <div role="group" tabIndex="0" aria-label="Audio player" className="rhap_container rhap_loop--off rhap_play-status--paused ">
                        <audio src="/img/colegio.mp3" preload="auto"></audio>
                        <div className="rhap_main rhap_stacked">
                            <div className="rhap_progress-section">
                                <div id="rhap_current-time" className="rhap_time rhap_current-time">--:--</div>
                                <div className="rhap_progress-container" aria-label="Audio progress control" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabIndex="0">
                                    <div className="rhap_progress-bar rhap_progress-bar-show-download">
                                        <div className="rhap_progress-indicator" style={{ left: '0%' }}></div>
                                        <div className="rhap_progress-filled" style={{ width: '0%' }}></div>
                                    </div>
                                </div>
                                <div className="rhap_time rhap_total-time">--:--</div>
                            </div>
                            <div className="rhap_controls-section">
                                <div className="rhap_additional-controls">
                                    <button aria-label="Enable loop" className="rhap_button-clear rhap_repeat-button" type="button">
                                        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M2 5.27L3.28 4L20 20.72L18.73 22l-3-3H7v3l-4-4l4-4v3h6.73L7 10.27V11H5V8.27l-3-3M17 13h2v4.18l-2-2V13m0-8V2l4 4l-4 4V7H8.82l-2-2H17Z"></path>
                                        </svg>
                                    </button>
                                </div>
                                <div className="rhap_main-controls">
                                    <button aria-label="Rewind" className="rhap_button-clear rhap_main-controls-button rhap_rewind-button" type="button">
                                        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="m11.5 12l8.5 6V6m-9 12V6l-8.5 6l8.5 6Z"></path>
                                        </svg>
                                    </button>
                                    <button aria-label="Play" className="rhap_button-clear rhap_main-controls-button rhap_play-pause-button" type="button">
                                        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M10 16.5v-9l6 4.5M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2Z"></path>
                                        </svg>
                                    </button>
                                    <button aria-label="Forward" className="rhap_button-clear rhap_main-controls-button rhap_forward-button" type="button">
                                        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M13 6v12l8.5-6M4 18l8.5-6L4 6v12Z"></path>
                                        </svg>
                                    </button>
                                </div>
                                <div className="rhap_volume-controls">
                                    <div className="rhap_volume-container">
                                        <button aria-label="Unmute" type="button" className="rhap_button-clear rhap_volume-button">
                                            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M3 9h4l5-5v16l-5-5H3V9m13.59 3L14 9.41L15.41 8L18 10.59L20.59 8L22 9.41L19.41 12L22 14.59L20.59 16L18 13.41L15.41 16L14 14.59L16.59 12Z"></path>
                                            </svg>
                                        </button>
                                        <div role="progressbar" aria-label="Volume control" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabIndex="0" className="rhap_volume-bar-area">
                                            <div className="rhap_volume-bar">
                                                <div className="rhap_volume-indicator" style={{ left: '0%', transitionDuration: '0s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* WhatsApp Button */}
                <div className="ico-whatsapp" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                    <img className="ico-img-wsp" src="/img/whatsapp.svg" width="50px" height="50px" alt="WhatsApp" />
                </div>

                <section>
                    <div>
                        <div className="powercolor">
                            <div className="container contibannertec">
                                <div className="row">
                                    <div className="col-sm contetexttecnico">
                                        <h2 className="text-tecnico">Necesitas ayuda <br /> con tu PC?</h2>
                                        <div className="alert alert-warning dangertecnico" role="alert">Llamanos ya!</div>
                                        <br />
                                        <a className="btn btn-danger imtecnico" target="_blank" rel="noopener noreferrer" href="https://api.whatsapp.com/send?phone=51900937418&text=Hola,%20Quisiera%20consultar%20sobre%20un%20servicio%20técnico">Imperial: 900937418</a>
                                        <a className="btn btn-danger svtecnico" target="_blank" rel="noopener noreferrer" href="https://api.whatsapp.com/send?phone=51921304402&text=Hola,%20Quisiera%20consultar%20sobre%20un%20servicio%20técnico">San Vicente: 921304402</a>
                                        <a className="btn btn-danger malatecnico" target="_blank" rel="noopener noreferrer" href="https://api.whatsapp.com/send?phone=51928914095&text=Hola,%20Quisiera%20consultar%20sobre%20un%20servicio%20técnico">Mala: 928914095</a>
                                    </div>
                                    <div className="col-sm col-img-tecnico">
                                        <img src="/img/soporte.png" className="imgslider" alt="Soporte" />
                                    </div>
                                    <div className="burbujas">
                                        <div className="efectobur"></div>
                                        <div className="efectobur"></div>
                                        <div className="efectobur"></div>
                                        <div className="efectobur"></div>
                                        <div className="efectobur"></div>
                                        <div className="efectobur"></div>
                                        <div className="efectobur"></div>
                                        <div className="efectobur"></div>
                                        <div className="efectobur"></div>
                                        <div className="efectobur"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container contegenetrabajo">
                            <div className="row rowtectrabajo">
                                <div className="col-sm col-pc-tecnico">
                                    <img src="/img/tec1.webp" className="imgtecnicotrabajo" alt="Computadoras" />
                                </div>
                                <div className="col-sm coltexttitle">
                                    <span className="titletecnicotra">Soporte técnico de Computadoras</span>
                                    <p className="ptecnico">Mantenimiento Preventivo - Mantenimiento Correptivo - Repuesto de pc - Formateo - Antivirus <br />También podemos repontenciar tu pc</p>
                                </div>
                            </div>
                            <div className="row rowtectrabajo">
                                <div className="col-sm coltexttitle">
                                    <span className="titletecnicotra colorteclap">Soporte técnico de Laptops</span>
                                    <p className="ptecnico">Mantenimiento Preventivo - Mantenimiento Correptivo - Repuesto para laptops - Formateo - Antivirus - Reparación de placas - Cambio de Pantalla - Reparación de Bizagra - Cambio de teclado<br />También podemos repontenciar tu laptop.</p>
                                </div>
                                <div className="col-sm col-pc-tecnico">
                                    <img src="/img/tec2.webp" className="imgtecnicotrabajo" alt="Laptops" />
                                </div>
                            </div>
                            <div className="row rowtectrabajo">
                                <div className="col-sm col-pc-tecnico">
                                    <img src="/img/tec3.webp" className="imgtecnicotrabajo" alt="Impresoras" />
                                </div>
                                <div className="col-sm coltexttitle">
                                    <span className="titletecnicotra colortecimp">Soporte técnico de Impresoras</span>
                                    <p className="ptecnico">Mantenimiento Preventivo - Mantenimiento Correptivo - Repuesto de Impresoras - Instalación de Sistema Continuo - Reset de Contador de Impresoras - Reparación de Impresoras Matriciales - Láser - A3 - A4 - Ticketera<br />Podemos ayudarte con las diferentes marcas de Impresoras.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default SupportView;
