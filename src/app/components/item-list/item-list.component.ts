import { Component, OnInit } from '@angular/core';
import { FirestoreService, Item } from '../../services/firestore.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  items: Item[] = [];
  newItem: Item = { name: '', description: '' };

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit(): void {
    this.firestoreService.getItems().subscribe(data => {
      console.log("Datos obtenidos desde Firestore:", data);
      this.items = data;
    });
  }


  // Agregar un nuevo item
  addItem() {
    if (this.newItem.name.trim() && this.newItem.description.trim()) {
      this.firestoreService.addItem(this.newItem).then(() => {
        this.newItem = { name: '', description: '' };
      });
    }
  }

  // Activar el modo edición
  editItem(item: Item) {
    item.editing = true;
  }

  // Guardar cambios en Firestore
  saveItem(item: Item) {
    if (item.id) {
      this.firestoreService.updateItem(item.id, {
        name: item.name,
        description: item.description
      }).then(() => {
        item.editing = false; // Salir del modo edición
      });
    }
  }

  // Eliminar un elemento
  deleteItem(id: string) {
    if (confirm("¿Estás seguro de que deseas eliminar este elemento?")) {
      this.firestoreService.deleteItem(id);
    }
  }
}
