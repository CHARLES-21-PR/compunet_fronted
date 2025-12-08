import { Link } from 'react-router-dom';

function Nav() {
    return (    
        <>
        <div className="navegation">
            <header>
                <div className="redes">

                    <div className="redes-var">
                        <img className="ico" src="img/ins.webp" alt="" srcSet="" />
                        <img className="ico" src="img/face.webp" alt="" srcSet="" />
                    </div>
                    <div className="redes-1">
                        <a href="">Inicio</a>
                        <a href="">Nuestras tiendas</a>
                        <a href="">Contáctanos</a>
                    </div>

                </div>
            </header>
        <nav>
           <div className="logo">
            <Link to="/"><img className="logo-img" src="img/logo.webp" alt="" /></Link>
               
           </div>

           <div className="nav-1">

            <div className="enlace enlace-show">

                <a className="menu_link" href=""><img className="icon1" src="img/l1.webp" alt="" />Equipos de computo<img className="arrow" src="assets/arrow.svg" alt="" /></a>

                
                <ul className="menu_nesting">
                    <li className="menu_inside">
                        <Link to="/category/Computadoras" className="menu_link menu_link--inside"><img className="icon2" src="img/a1.webp" alt="" />Computadoras</Link>
                    </li>
                    <li className="menu_inside">
                        <Link to="/category/Laptops" className="menu_link menu_link--inside"><img className="icon2" src="img/a2.webp" alt="" />Laptops</Link>
                    </li>
                    <li className="menu_inside">
                        <Link to="/category/Tablets" className="menu_link menu_link--inside"><img className="icon2" src="img/a3.webp" alt="" />Tablets</Link>
                    </li>
                </ul>
            </div>
            <div className="enlace ">
                <Link to="/category/Impresoras" className="menu_link"><img className="icon1" src="img/l2.webp" alt="" />Impresoras</Link> 
            </div>
            <div className="enlace enlace-show">
                <a className="menu_link" href=""><img className="icon1" src="img/l3.webp" alt="" />Catálogos<img className="arrow" src="assets/arrow.svg" alt="" /></a>
                <ul className="menu_nesting">
                    <li className="menu_inside">
                        <Link to="/category/Tintas" className="menu_link menu_link--inside"><img className="icon2" src="img/a4.webp" alt="" />Tintas</Link>
                    </li>
                    <li className="menu_inside">
                        <Link to="/category/SSD" className="menu_link menu_link--inside"><img className="icon2" src="img/a5.webp" alt="" />SSD</Link>
                    </li>
                    <li className="menu_inside">
                        <Link to="/category/COMBO GAMER" className="menu_link menu_link--inside"><img className="icon2" src="img/a6.webp" alt="" />COMBO GAMER</Link>
                    </li>
                </ul>
            </div>
            <div className="enlace ">
                <Link to="/category/Internet ilimitado" className="menu_link"><img className="icon1" src="img/l4.webp" alt="" />Internet ilimitado</Link>
            </div>
            <div className="enlace enlace-show">
                <a className="menu_link" href=""><img className="icon1" src="img/l5.webp" alt="" />Atención especializada<img className="arrow" src="assets/arrow.svg" alt="" /></a>
                <ul className="menu_nesting">
                    <li className="menu_inside">
                        <Link to="/category/Camara de vigilancia" className="menu_link menu_link--inside"><img className="icon2" src="img/a7.webp" alt="" />Camara de vigilancia</Link>
                    </li>
                    <li className="menu_inside">
                        <Link to="/category/Soporte técnico" className="menu_link menu_link--inside"><img className="icon2" src="img/a8.webp" alt="" />Soporte técnico</Link>
                    </li>
                    <li className="menu_inside">
                        <Link to="/category/Nuestros clientes" className="menu_link menu_link--inside"><img className="icon2" src="img/a9.webp" alt="" />Nuestros clientes</Link>
                    </li>
                </ul>
            </div>
                         
                
             </div>
             <div className="menu_hamburguer">
                <img className="menu_img" src="assets/menu.svg" alt="" />
             </div>

       </nav>
        </div>
        </>
    );
}
export default Nav;