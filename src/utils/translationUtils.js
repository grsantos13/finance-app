export default class TranslationUtils {
  bool = [
    { name: true, translation: "SIM" },
    { name: false, translation: "NÃO" }
  ];

  translate(obj, type) {
    var filtered = this[type].filter(element => {
      return element.name == obj;
    });

    if (filtered.length > 0) {
      return filtered[0].translation;
    } else {
      return null;
    }
  }

  translateBack(obj, type) {
    var filtered = this[type].filter(element => {
      return element.translation == obj;
    });

    if (filtered.length > 0) {
      return filtered[0].name;
    } else {
      return null;
    }
  }
}
