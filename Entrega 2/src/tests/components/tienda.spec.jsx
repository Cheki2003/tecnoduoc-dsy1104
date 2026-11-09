import { act, fireEvent, screen, within } from "@testing-library/react";

import BarraNavegacion from "../../components/BarraNavegacion";
import Buscador from "../../components/Buscador";
import Carrusel from "../../components/Carrusel";
import ItemCarrito from "../../components/ItemCarrito";
import ListaProductos from "../../components/ListaProductos";
import RutaProtegida from "../../components/RutaProtegida";
import SelectorRegion from "../../components/SelectorRegion";
import TarjetaProducto from "../../components/TarjetaProducto";
import baseDatos from "../../data/baseDatos";
import { itemEjemplo, productoEjemplo, renderConRouter, renderEnRuta } from "../ayuda";

describe("TarjetaProducto", () => {
  it("muestra los datos del producto", () => {
    renderConRouter(<TarjetaProducto producto={productoEjemplo} onAgregar={() => {}} />);
    expect(screen.getByText("Teclado de prueba")).toBeTruthy();
    expect(screen.getByText("$10.000")).toBeTruthy();
    expect(screen.getByText("Periféricos")).toBeTruthy();
  });

  it("con descuento muestra la etiqueta y el precio anterior", () => {
    renderConRouter(<TarjetaProducto producto={{ ...productoEjemplo, descuento: 20 }} onAgregar={() => {}} />);
    expect(screen.getByText("-20%")).toBeTruthy();
    expect(screen.getByText("$8.000")).toBeTruthy();
    expect(screen.getByText("$10.000").className).toContain("precio-anterior");
  });

  it("sin descuento no muestra la etiqueta", () => {
    renderConRouter(<TarjetaProducto producto={productoEjemplo} onAgregar={() => {}} />);
    expect(screen.queryByText(/%/)).toBeNull();
  });

  it("al hacer clic en agregar entrega el producto al padre", () => {
    const alAgregar = jasmine.createSpy("onAgregar");
    renderConRouter(<TarjetaProducto producto={productoEjemplo} onAgregar={alAgregar} />);
    fireEvent.click(screen.getByRole("button", { name: "Agregar" }));
    expect(alAgregar).toHaveBeenCalledOnceWith(productoEjemplo);
  });

  it("sin stock el boton queda deshabilitado", () => {
    renderConRouter(<TarjetaProducto producto={{ ...productoEjemplo, stock: 0 }} onAgregar={() => {}} />);
    expect(screen.getByRole("button", { name: "Sin stock" }).disabled).toBeTrue();
  });

  it("avisa cuando quedan pocas unidades", () => {
    renderConRouter(<TarjetaProducto producto={{ ...productoEjemplo, stock: 3 }} onAgregar={() => {}} />);
    expect(screen.getByText("Quedan 3 unidades")).toBeTruthy();
  });
});

describe("ListaProductos", () => {
  it("dibuja una tarjeta por cada producto del conjunto de datos", () => {
    baseDatos.reiniciar();
    const productos = baseDatos.obtenerProductos();
    renderConRouter(<ListaProductos productos={productos} onAgregar={() => {}} />);
    expect(screen.getAllByRole("article").length).toBe(productos.length);
  });

  it("con la lista vacia muestra el mensaje que recibe", () => {
    renderConRouter(<ListaProductos productos={[]} onAgregar={() => {}} mensajeVacio="Nada por aquí" />);
    expect(screen.getByText("Nada por aquí")).toBeTruthy();
    expect(screen.queryByRole("article")).toBeNull();
  });
});

describe("Carrusel (estado y temporizador)", () => {
  const diapositivas = [
    { titulo: "Uno", etiqueta: "a", texto: "x", imagen: "", enlace: "/", textoBoton: "Ver" },
    { titulo: "Dos", etiqueta: "b", texto: "y", imagen: "", enlace: "/", textoBoton: "Ver" },
    { titulo: "Tres", etiqueta: "c", texto: "z", imagen: "", enlace: "/", textoBoton: "Ver" },
  ];

  beforeEach(() => jasmine.clock().install());
  afterEach(() => jasmine.clock().uninstall());

  it("parte en la primera diapositiva", () => {
    renderConRouter(<Carrusel diapositivas={diapositivas} />);
    expect(screen.getByTestId("carrusel-posicion").textContent).toBe("1 / 3");
  });

  it("avanza con el boton siguiente", () => {
    renderConRouter(<Carrusel diapositivas={diapositivas} />);
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
    expect(screen.getByTestId("carrusel-posicion").textContent).toBe("2 / 3");
  });

  it("desde la primera, anterior vuelve a la ultima", () => {
    renderConRouter(<Carrusel diapositivas={diapositivas} />);
    fireEvent.click(screen.getByRole("button", { name: "Anterior" }));
    expect(screen.getByTestId("carrusel-posicion").textContent).toBe("3 / 3");
  });

  it("cambia solo cuando pasa el tiempo", () => {
    renderConRouter(<Carrusel diapositivas={diapositivas} intervalo={1000} />);
    act(() => jasmine.clock().tick(1000));
    expect(screen.getByTestId("carrusel-posicion").textContent).toBe("2 / 3");
  });
});

describe("BarraNavegacion (renderizado segun la sesion)", () => {
  beforeEach(() => baseDatos.reiniciar());

  it("sin sesion ofrece iniciar sesion y crear cuenta", () => {
    renderConRouter(<BarraNavegacion usuario={null} carrito={[]} onCerrarSesion={() => {}} />);
    expect(screen.getByRole("link", { name: "Iniciar sesión" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Crear cuenta" })).toBeTruthy();
    expect(screen.queryByText("Panel admin")).toBeNull();
  });

  it("un usuario normal no ve el panel admin", () => {
    renderConRouter(<BarraNavegacion usuario={{ nombre: "Ana", rol: "usuario" }} carrito={[]} onCerrarSesion={() => {}} />);
    expect(screen.getByText("Ana")).toBeTruthy();
    expect(screen.queryByText("Panel admin")).toBeNull();
  });

  it("el administrador si ve el panel admin", () => {
    renderConRouter(<BarraNavegacion usuario={{ nombre: "Admin", rol: "admin" }} carrito={[]} onCerrarSesion={() => {}} />);
    expect(screen.getByText("Panel admin")).toBeTruthy();
  });

  it("el contador suma las unidades del carrito", () => {
    renderConRouter(<BarraNavegacion usuario={null} carrito={[itemEjemplo, { ...itemEjemplo, id: 51, cantidad: 3 }]} onCerrarSesion={() => {}} />);
    expect(screen.getByTestId("contador-carrito").textContent).toBe("5");
  });

  it("el boton salir llama a onCerrarSesion", () => {
    const alSalir = jasmine.createSpy("onCerrarSesion");
    renderConRouter(<BarraNavegacion usuario={{ nombre: "Ana", rol: "usuario" }} carrito={[]} onCerrarSesion={alSalir} />);
    fireEvent.click(screen.getByRole("button", { name: "Salir" }));
    expect(alSalir).toHaveBeenCalled();
  });

  it("al elegir una pagina el menu movil se cierra", () => {
    renderConRouter(<BarraNavegacion usuario={null} carrito={[]} onCerrarSesion={() => {}} />);
    const boton = screen.getByRole("button", { name: "Abrir menú" });
    fireEvent.click(boton);
    fireEvent.click(screen.getByRole("link", { name: "Ofertas" }));
    expect(boton.getAttribute("aria-expanded")).toBe("false");
  });

  it("el boton del menu abre y cierra el menu movil", () => {
    renderConRouter(<BarraNavegacion usuario={null} carrito={[]} onCerrarSesion={() => {}} />);
    const boton = screen.getByRole("button", { name: "Abrir menú" });
    expect(boton.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(boton);
    expect(boton.getAttribute("aria-expanded")).toBe("true");
  });

  it("muestra las categorias de la base de datos en el menu", () => {
    renderConRouter(<BarraNavegacion usuario={null} carrito={[]} onCerrarSesion={() => {}} />);
    expect(screen.getByRole("link", { name: "Laptops" }).getAttribute("href")).toBe("/categorias/1");
  });
});

describe("Buscador", () => {
  it("guarda lo que se escribe en el estado", () => {
    renderConRouter(<Buscador />);
    const campo = screen.getByRole("searchbox");
    fireEvent.change(campo, { target: { value: "mouse" } });
    expect(campo.value).toBe("mouse");
  });

  it("funciona aunque el padre no entregue onBuscar", () => {
    renderEnRuta(<Buscador />, "/", "/");
    fireEvent.submit(screen.getByRole("search"));
    expect(screen.getByTestId("ruta-actual").textContent).toBe("/productos");
  });

  it("al enviar va al catalogo y avisa al padre", () => {
    const alBuscar = jasmine.createSpy("onBuscar");
    renderEnRuta(<Buscador onBuscar={alBuscar} />, "/", "/");
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "mouse" } });
    fireEvent.submit(screen.getByRole("search"));
    expect(screen.getByTestId("ruta-actual").textContent).toBe("/productos");
    expect(alBuscar).toHaveBeenCalled();
  });
});

describe("RutaProtegida", () => {
  const contenido = <p>Secreto</p>;

  it("sin sesion manda al login", () => {
    renderEnRuta(<RutaProtegida usuario={null} rolRequerido="admin">{contenido}</RutaProtegida>, "/admin", "/admin");
    expect(screen.queryByText("Secreto")).toBeNull();
    expect(screen.getByTestId("ruta-actual").textContent).toBe("/login");
  });

  it("con otro rol manda al inicio", () => {
    renderEnRuta(<RutaProtegida usuario={{ rol: "usuario" }} rolRequerido="admin">{contenido}</RutaProtegida>, "/admin", "/admin");
    expect(screen.getByTestId("ruta-actual").textContent).toBe("/");
  });

  it("con el rol correcto muestra el contenido", () => {
    renderEnRuta(<RutaProtegida usuario={{ rol: "admin" }} rolRequerido="admin">{contenido}</RutaProtegida>, "/admin", "/admin");
    expect(screen.getByText("Secreto")).toBeTruthy();
  });
});

describe("ItemCarrito (eventos)", () => {
  it("calcula el subtotal y muestra la cantidad", () => {
    renderConRouter(<ItemCarrito item={itemEjemplo} onCambiarCantidad={() => {}} onQuitar={() => {}} />);
    expect(screen.getByText("$20.000")).toBeTruthy();
    expect(within(screen.getByRole("group")).getByText("2")).toBeTruthy();
  });

  it("los botones avisan al padre con el id y el cambio", () => {
    const alCambiar = jasmine.createSpy("onCambiarCantidad");
    const alQuitar = jasmine.createSpy("onQuitar");
    renderConRouter(<ItemCarrito item={itemEjemplo} onCambiarCantidad={alCambiar} onQuitar={alQuitar} />);

    fireEvent.click(screen.getByRole("button", { name: "Agregar una unidad" }));
    expect(alCambiar).toHaveBeenCalledWith(50, 1);
    fireEvent.click(screen.getByRole("button", { name: "Quitar una unidad" }));
    expect(alCambiar).toHaveBeenCalledWith(50, -1);
    fireEvent.click(screen.getByRole("button", { name: "Eliminar Teclado de prueba" }));
    expect(alQuitar).toHaveBeenCalledWith(50);
  });

  it("no deja agregar mas si ya llego al stock", () => {
    renderConRouter(<ItemCarrito item={{ ...itemEjemplo, cantidad: 3 }} onCambiarCantidad={() => {}} onQuitar={() => {}} />);
    expect(screen.getByRole("button", { name: "Agregar una unidad" }).disabled).toBeTrue();
  });
});

describe("SelectorRegion", () => {
  it("la comuna esta bloqueada hasta elegir una region", () => {
    renderConRouter(<SelectorRegion region="" comuna="" onChange={() => {}} />);
    expect(screen.getByLabelText("Comuna").disabled).toBeTrue();
  });

  it("muestra las comunas de la region elegida", () => {
    renderConRouter(<SelectorRegion region="Región de Ñuble" comuna="" onChange={() => {}} />);
    expect(within(screen.getByLabelText("Comuna")).getByRole("option", { name: "Chillán" })).toBeTruthy();
  });

  it("al cambiar la region tambien limpia la comuna", () => {
    const alCambiar = jasmine.createSpy("onChange");
    renderConRouter(<SelectorRegion region="Región de Ñuble" comuna="Chillán" onChange={alCambiar} />);
    fireEvent.change(screen.getByLabelText("Región"), { target: { value: "Región de Atacama" } });
    expect(alCambiar).toHaveBeenCalledTimes(2);
    expect(alCambiar.calls.mostRecent().args[0].target).toEqual({ name: "comuna", value: "" });
  });
});
