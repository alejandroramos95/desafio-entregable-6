module.exports = class Contenedor {
  constructor() {
    this.array = [];
  }

  getAll() {
    return this.array;
  }

  getById(id) {
    return this.array.find((item) => item.id == id);
  }

  save(itemNuevo) {
    if (this.array.length) {
      const arrayAOrdenar = [...this.array];
      const indice = arrayAOrdenar.sort((a, b) => b.id - a.id)[0].id;
      itemNuevo.id = indice + 1;
    } else {
      itemNuevo.id = 1;
    }
    this.array.push(itemNuevo);
    return itemNuevo;
  }

  updateItem(obj, id) {
    for (let i = 0; i < this.array.length; i++) {
      if (id == this.array[i].id) {
        this.array[i].price = obj.price;
        this.array[i].thumbnail = obj.thumbnail;
        this.array[i].title = obj.title;
      }
    }
  }

  deleteById(id) {
    this.array = this.array.filter((item) => item.id != id);
  }
};
