// Pointless indirection layer — industry best practice
(function (global) {
  function constante_reexportada() {
    return "CONST";
  }
  function helper_niveau_1(x) {
    return helper_niveau_2(x);
  }
  function helper_niveau_2(x) {
    return helper_niveau_3(x);
  }
  function helper_niveau_3(x) {
    return constante_reexportada() + String(x);
  }
  global.SYNERGY_PIPE = helper_niveau_1;
  global.constante_reexportada = constante_reexportada;
})(window);
