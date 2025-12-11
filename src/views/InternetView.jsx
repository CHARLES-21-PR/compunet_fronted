import React from 'react';
import { Box } from '@mui/material';
import './InternetView.css';

function InternetView() {
    return (
        <Box>
            <div className="powercolorinter">
                <div className="container saltocontebanner">
                    <div className="row">
                        <div className="col-6 contebaner">
                            <span className="txttitleinterbanner">INTERNET ILIMITADO </span>
                            <span className="conteinterbanner">Navega por Internet, por las redes sociales y escucha tu musica todo al mismo tiempo. Disfruta de videos, peliculas, netflix, disney entre otros con la mejor velocidad y el mejor costo. COBERTURA EN CAÑETE.</span>
                            <br />
                            <div className="descriante">
                                <img className="mikro" src="/img/mikrotik.png" alt="Mikrotik" />
                                <br />
                                <span className="subtextbanner"><span className="colrfibr">¡ FIBRA</span> ÓPTICA = INTERNET <span className="colrfibr">SIMÉTRICO !</span></span>
                                <br />
                                <span className="subtextbanner">¡ DOWNLOAD = UPLOAD ! <img className="img-inter" src="/img/subidabajada.png" alt="Upload/Download" /> </span>
                            </div>
                        </div>
                        <div className="col colcontemo">
                            <img className="imgante" src="/img/internet1.png" alt="Internet" />
                        </div>
                        <div className="burbujas">
                            <div className="efectobur"></div><div className="efectobur"></div><div className="efectobur"></div><div className="efectobur"></div><div className="efectobur"></div><div className="efectobur"></div><div className="efectobur"></div><div className="efectobur"></div><div className="efectobur"></div><div className="efectobur"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container saltomesgratis">
                <div className="row">
                    <div className="col">
                        <div className="destitlein">TENEMOS LOS <br />MEJORES PRECIOS <br /> Y PROMOCIONES!</div>
                        <br />
                        <div className="paratitlein">Con una instalación Rápida y Eficiente de nuestro servicio de internet.</div>
                        <img className="motointer" src="/img/motodomicilio.webp" alt="Moto" />
                    </div>
                    <div className="col conteimmoto">
                        <img className="intermes" src="/img/gratis.webp" alt="Gratis" />
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <div className="alert alert-danger alertherra texttitleherra" role="alert">Equipos a utilizar para la instalación del servicio de internet.</div>
                    <div className="alert alert-primary alertherra" role="alert">
                        <div className="row">
                            <div className="col colherra"><span className="descriherra">Palo o Mastil de 8Mtrs</span><br /><img className="imgherra" src="/img/palo.png" alt="Palo" /></div>
                            <div className="col colherra"><span className="descriherra">1Kg de Alambre Galvanizado #16</span><br /><img className="imgherra" src="/img/alambre.png" alt="Alambre" /></div>
                            <div className="col colherra"><span className="descriherra">Antena Mikrotik</span><br /><img data-toggle="tooltip" data-placement="top" className="imgherra" src="/img/antena.png" alt="Antena" /></div>
                            <div className="col colherra"><span className="descriherra">Router</span><br /><img className="imgherra" src="/img/router.png" alt="Router" /></div>
                        </div>
                    </div>
                    <div className="alert alert-warning alertherra footerherra" role="alert">Para mayor información escribenos al numero de whatsapp.<a className="enlace enherra" target="_blank" href="https://api.whatsapp.com/send?phone=51900640484&text=Hola,%20Quisiera%20consultar%20sobre%20el%20internet" rel="noreferrer"><img className="icowspherra" src="/img/733585.png" alt="Whatsapp" /> 916206379 - 900640484</a></div>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <div className="col color1">
                        <div className="contetextple"><h1 className="titlepl">SIMÉTRICO BASICO</h1><p className="parrapl">Navega por internet con el mejor costo ideal para estudiantes.</p><h1 className="monpl">S/ 30.00</h1><img className="ocultar" src="/img/internet/undefined" alt="" /></div>
                        <img className="basicoimg" src="/img/internet/basico.webp" alt="Basico" />
                    </div>
                    <div className="col color2">
                        <div className="contetextple"><h1 className="titlepl">SIMÉTRICO INTERMEDIO</h1><p className="parrapl">Navega por internet, REDES SOCIALES y escucha TU MUSICA todo al mismo tiempo.</p><h1 className="monpl">S/ 60.00</h1><img className="ocultar" src="/img/internet/undefined" alt="" /></div>
                        <img className="basicoimg" src="/img/internet/intermedio.webp" alt="Intermedio" />
                    </div>
                    <div className="col color3">
                        <div className="contetextple"><h1 className="titlepl">SIMÉTRICO PREMIUM</h1><p className="parrapl">Disfruta de videos, peliculas, netflix con la mejor velocidad.</p><h1 className="monpl">S/ 90.00</h1><img className="ocultar" src="/img/internet/undefined" alt="" /></div>
                        <img className="basicoimg" src="/img/internet/premium.webp" alt="Premium" />
                    </div>
                    <div className="col color4">
                        <div className="contetextple"><h1 className="titlepl">SIMÉTRICO NEGOCIOS</h1><p className="parraplnego">Ideal para camaras de seguridad, minicabinas y agentes.</p><h1 className="monpl">S/ 120.00</h1><img className="agenteimg" src="/img/internet/agente.webp" alt="Agente" /></div>
                        <img className="basinego" src="/img/internet/negocios.webp" alt="Negocios" />
                    </div>
                </div>
            </div>
        </Box>
    );
}

export default InternetView;
