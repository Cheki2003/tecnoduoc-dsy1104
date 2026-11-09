import { fireEvent, render, screen } from "@testing-library/react";

import FormularioCategoria from "../../components/FormularioCategoria";
import FormularioProducto from "../../components/FormularioProducto";
import FormularioUsuario from "../../components/FormularioUsuario";
import { productoEjemplo } from "../ayuda";

const categorias = [{ id: 1, nombre: "Audio" }, { id: 2, nombre: "Laptops" }];

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
}

describe("FormularioProducto", () => {
  it("el estado cambia cuando el usuario escribe", () => {
    render(<FormularioProducto categorias={categorias} onGuardar={() => {}} onCancelar={() => {}} />);
    escribir("Nombre", "Webcam");
    expect(screen.getByLabelText("Nombre").value).toBe("Webcam");
  });

  it("con datos invalidos muestra errores y no guarda", () => {
    const alGuardar = jasmine.createSpy("onGuardar");
    render(<FormularioProducto categorias={categorias} onGuardar={alGuardar} onCancelar={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Guardar producto" }));
    expect(screen.getByText("Ingresa el nombre del producto.")).toBeTruthy();
    expect(alGuardar).not.toHaveBeenCalled();
  });

  it("al guardar entrega los numeros convertidos y separa las caracteristicas", () => {
    const alGuardar = jasmine.createSpy("onGuardar");
    render(<FormularioProducto categorias={categorias} onGuardar={alGuardar} onCancelar={() => {}} />);
    escribir("Nombre", " Webcam ");
    escribir("Categoría", "Audio");
    escribir("Precio (CLP)", "25000");
    escribir("Stock", "4");
    escribir("Descripción", "Una webcam");
    escribir("Características (opcional)", "HD\n\nCon micrófono");
    fireEvent.click(screen.getByLabelText("Mostrar en productos destacados"));
    fireEvent.click(screen.getByRole("button", { name: "Guardar producto" }));

    const datos = alGuardar.calls.mostRecent().args[0];
    expect(datos.nombre).toBe("Webcam");
    expect(datos.precio).toBe(25000);
    expect(datos.stock).toBe(4);
    expect(datos.caracteristicas).toEqual(["HD", "Con micrófono"]);
    expect(datos.destacado).toBeTrue();
  });

  it("al editar parte con los datos del producto", () => {
    render(<FormularioProducto inicial={{ ...productoEjemplo, categoria: "Audio" }} categorias={categorias} onGuardar={() => {}} onCancelar={() => {}} />);
    expect(screen.getByLabelText("Nombre").value).toBe("Teclado de prueba");
    expect(screen.getByLabelText("Categoría").value).toBe("Audio");
    expect(screen.getByLabelText("Características (opcional)").value).toBe("Con cable");
  });

  it("el boton cancelar llama a onCancelar", () => {
    const alCancelar = jasmine.createSpy("onCancelar");
    render(<FormularioProducto categorias={categorias} onGuardar={() => {}} onCancelar={alCancelar} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(alCancelar).toHaveBeenCalled();
  });
});

describe("FormularioCategoria", () => {
  it("valida antes de guardar", () => {
    const alGuardar = jasmine.createSpy("onGuardar");
    render(<FormularioCategoria onGuardar={alGuardar} onCancelar={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Guardar categoría" }));
    expect(screen.getByText("Ingresa el nombre de la categoría.")).toBeTruthy();
    expect(alGuardar).not.toHaveBeenCalled();
  });

  it("guarda los datos correctos", () => {
    const alGuardar = jasmine.createSpy("onGuardar");
    render(<FormularioCategoria onGuardar={alGuardar} onCancelar={() => {}} />);
    escribir("Nombre", "Cámaras");
    escribir("Descripción", "Webcams");
    fireEvent.click(screen.getByRole("button", { name: "Guardar categoría" }));
    expect(alGuardar.calls.mostRecent().args[0].nombre).toBe("Cámaras");
  });
});

describe("FormularioUsuario", () => {
  function llenarBase() {
    escribir("Nombre", "Ana");
    escribir("Apellidos", "Pérez");
    escribir("Correo", "ana@duoc.cl");
  }

  it("el campo rol solo aparece si se pide por props", () => {
    const { rerender } = render(<FormularioUsuario onGuardar={() => {}} />);
    expect(screen.queryByLabelText("Rol")).toBeNull();
    rerender(<FormularioUsuario mostrarRol onGuardar={() => {}} />);
    expect(screen.getByLabelText("Rol")).toBeTruthy();
  });

  it("no guarda si las claves no coinciden", () => {
    const alGuardar = jasmine.createSpy("onGuardar");
    render(<FormularioUsuario onGuardar={alGuardar} />);
    llenarBase();
    escribir("Contraseña", "123456");
    escribir("Confirmar contraseña", "000000");
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));
    expect(screen.getByText("Las contraseñas no coinciden.")).toBeTruthy();
    expect(alGuardar).not.toHaveBeenCalled();
  });

  it("guarda los datos sin el campo confirmar", () => {
    const alGuardar = jasmine.createSpy("onGuardar");
    render(<FormularioUsuario onGuardar={alGuardar} />);
    llenarBase();
    escribir("Contraseña", "123456");
    escribir("Confirmar contraseña", "123456");
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));
    const datos = alGuardar.calls.mostRecent().args[0];
    expect(datos.clave).toBe("123456");
    expect(datos.confirmar).toBeUndefined();
  });

  it("muestra los errores que devuelve onGuardar", () => {
    render(<FormularioUsuario onGuardar={() => ({ correo: "Este correo ya existe" })} />);
    llenarBase();
    escribir("Contraseña", "123456");
    escribir("Confirmar contraseña", "123456");
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));
    expect(screen.getByText("Este correo ya existe")).toBeTruthy();
  });

  it("al editar sin escribir clave no la manda", () => {
    const alGuardar = jasmine.createSpy("onGuardar");
    const inicial = { nombre: "Ana", apellidos: "Pérez", correo: "ana@duoc.cl", rol: "usuario", calle: "", depto: "", region: "", comuna: "" };
    render(<FormularioUsuario inicial={inicial} onGuardar={alGuardar} />);
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));
    expect(Object.keys(alGuardar.calls.mostRecent().args[0])).not.toContain("clave");
  });

  it("cambiar la region actualiza la region y limpia la comuna", () => {
    const inicial = { nombre: "Ana", apellidos: "P", correo: "a@b.cl", rol: "usuario", calle: "", depto: "", region: "Región de Ñuble", comuna: "Chillán" };
    render(<FormularioUsuario inicial={inicial} onGuardar={() => {}} />);
    escribir("Región", "Región de Atacama");
    expect(screen.getByLabelText("Región").value).toBe("Región de Atacama");
    expect(screen.getByLabelText("Comuna").value).toBe("");
  });
});
