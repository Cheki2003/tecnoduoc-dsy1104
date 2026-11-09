import { act, fireEvent, render, screen } from "@testing-library/react";

import Aviso from "../../components/Aviso";
import BarraProgreso from "../../components/BarraProgreso";
import Boton from "../../components/Boton";
import CampoFormulario from "../../components/CampoFormulario";
import CampoSelect from "../../components/CampoSelect";
import EstadoOrden from "../../components/EstadoOrden";
import Imagen from "../../components/Imagen";
import ResumenTotales from "../../components/ResumenTotales";
import TarjetaEstadistica from "../../components/TarjetaEstadistica";

describe("Boton (props y eventos)", () => {
  it("muestra la etiqueta que recibe", () => {
    render(<Boton etiqueta="Guardar" />);
    expect(screen.getByRole("button", { name: "Guardar" })).toBeTruthy();
  });

  it("llama a la funcion onClick al hacer clic", () => {
    const alHacerClic = jasmine.createSpy("onClick");
    render(<Boton etiqueta="Guardar" onClick={alHacerClic} />);
    fireEvent.click(screen.getByRole("button"));
    expect(alHacerClic).toHaveBeenCalledTimes(1);
  });

  it("deshabilitado no ejecuta el onClick", () => {
    const alHacerClic = jasmine.createSpy("onClick");
    render(<Boton etiqueta="Guardar" onClick={alHacerClic} deshabilitado />);
    fireEvent.click(screen.getByRole("button"));
    expect(alHacerClic).not.toHaveBeenCalled();
  });

  it("aplica la variante y el tipo que recibe", () => {
    render(<Boton etiqueta="Enviar" variante="danger" tipo="submit" />);
    const boton = screen.getByRole("button");
    expect(boton.className).toContain("btn-danger");
    expect(boton.getAttribute("type")).toBe("submit");
  });
});

describe("CampoFormulario (renderizado condicional)", () => {
  it("el mensaje de error solo aparece cuando hay error", () => {
    const { rerender } = render(<CampoFormulario etiqueta="Correo" nombre="correo" valor="" onChange={() => {}} />);
    expect(screen.queryByText("Falta el correo")).toBeNull();

    rerender(<CampoFormulario etiqueta="Correo" nombre="correo" valor="" onChange={() => {}} error="Falta el correo" />);
    expect(screen.getByText("Falta el correo")).toBeTruthy();
    expect(screen.getByLabelText("Correo").className).toContain("is-invalid");
  });

  it("la ayuda se esconde cuando hay error", () => {
    const { rerender } = render(<CampoFormulario etiqueta="Clave" nombre="clave" valor="" onChange={() => {}} ayuda="Mínimo 6" />);
    expect(screen.getByText("Mínimo 6")).toBeTruthy();
    rerender(<CampoFormulario etiqueta="Clave" nombre="clave" valor="" onChange={() => {}} ayuda="Mínimo 6" error="Muy corta" />);
    expect(screen.queryByText("Mínimo 6")).toBeNull();
  });

  it("con tipo textarea dibuja un area de texto", () => {
    render(<CampoFormulario etiqueta="Mensaje" nombre="mensaje" tipo="textarea" valor="hola" onChange={() => {}} />);
    expect(screen.getByLabelText("Mensaje").tagName).toBe("TEXTAREA");
  });

  it("avisa al escribir", () => {
    const alCambiar = jasmine.createSpy("onChange");
    render(<CampoFormulario etiqueta="Nombre" nombre="nombre" valor="" onChange={alCambiar} />);
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Ana" } });
    expect(alCambiar).toHaveBeenCalled();
  });
});

describe("CampoSelect", () => {
  it("dibuja todas las opciones mas la inicial", () => {
    render(<CampoSelect etiqueta="Rol" nombre="rol" valor="" onChange={() => {}} opciones={["usuario", "admin"]} />);
    expect(screen.getAllByRole("option").length).toBe(3);
  });

  it("muestra el error si lo recibe", () => {
    render(<CampoSelect etiqueta="Rol" nombre="rol" valor="" onChange={() => {}} opciones={[]} error="Elige uno" />);
    expect(screen.getByText("Elige uno")).toBeTruthy();
  });
});

describe("Aviso (estado y temporizador con mock de reloj)", () => {
  beforeEach(() => jasmine.clock().install());
  afterEach(() => jasmine.clock().uninstall());

  it("no dibuja nada si no hay mensaje", () => {
    const { container } = render(<Aviso mensaje="" onCerrar={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it("muestra el mensaje y se cierra solo despues de 3 segundos", () => {
    const alCerrar = jasmine.createSpy("onCerrar");
    render(<Aviso mensaje="Listo" onCerrar={alCerrar} />);
    expect(screen.getByRole("status").textContent).toContain("Listo");

    act(() => jasmine.clock().tick(2999));
    expect(alCerrar).not.toHaveBeenCalled();
    act(() => jasmine.clock().tick(1));
    expect(alCerrar).toHaveBeenCalledTimes(1);
  });

  it("se puede cerrar con el boton", () => {
    const alCerrar = jasmine.createSpy("onCerrar");
    render(<Aviso mensaje="Listo" onCerrar={alCerrar} />);
    fireEvent.click(screen.getByRole("button", { name: "Cerrar aviso" }));
    expect(alCerrar).toHaveBeenCalled();
  });
});

describe("Imagen (estado)", () => {
  it("usa la imagen que recibe por props", () => {
    render(<Imagen src="foto.png" alt="foto" />);
    expect(screen.getByAltText("foto").getAttribute("src")).toBe("foto.png");
  });

  it("cambia a la imagen de reemplazo si falla la carga", () => {
    render(<Imagen src="foto.png" alt="foto" />);
    fireEvent.error(screen.getByAltText("foto"));
    expect(screen.getByAltText("foto").getAttribute("src")).toBe("/img/sin-imagen.svg");
  });
});

describe("ResumenTotales, EstadoOrden y otros", () => {
  it("el descuento solo se muestra si es mayor a cero", () => {
    const { rerender } = render(<ResumenTotales subtotal={100} total={100} />);
    expect(screen.queryByText("Descuento")).toBeNull();
    rerender(<ResumenTotales subtotal={100} descuento={10} total={90} />);
    expect(screen.getByText("Descuento")).toBeTruthy();
    expect(screen.getByTestId("total").textContent).toBe("$90");
  });

  it("el envio en cero se muestra como gratis", () => {
    render(<ResumenTotales subtotal={100} costoEnvio={0} total={100} />);
    expect(screen.getByText("Gratis")).toBeTruthy();
  });

  it("EstadoOrden cambia texto y color segun el estado", () => {
    const { rerender } = render(<EstadoOrden estado="pagada" />);
    expect(screen.getByText("Pagada").className).toContain("success");
    rerender(<EstadoOrden estado="rechazada" />);
    expect(screen.getByText("Rechazada").className).toContain("danger");
  });

  it("TarjetaEstadistica muestra los datos que recibe", () => {
    render(<TarjetaEstadistica titulo="Compras" valor={5} detalle="este mes" icono="cart" />);
    expect(screen.getByText("Compras")).toBeTruthy();
    expect(screen.getByText("5")).toBeTruthy();
    expect(screen.getByText("este mes")).toBeTruthy();
  });

  it("BarraProgreso usa el valor como ancho", () => {
    render(<BarraProgreso etiqueta="Audio" texto="10" valor={40} />);
    expect(screen.getByRole("progressbar").firstChild.style.width).toBe("40%");
  });
});
