function parsedHandlebar() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['handlebar-education'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "\n<div class=\"toggler public\"\n";}

function program3(depth0,data) {
  
  
  return " \n<div class=\"toggler\"\n";}

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<div>Degree:";
  stack1 = depth0.education;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.degree;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</div>\n";
  return buffer;}

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<div>School:";
  stack1 = depth0.education;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.schoolName;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</div>\n";
  return buffer;}

  stack1 = depth0.education;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.publish;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " \n\nid=";
  foundHelper = helpers.ref;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.ref; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + ">\n\n\n";
  stack1 = depth0.education;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.degree;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(5, program5, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  stack1 = depth0.education;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.schoolName;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(7, program7, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n</div>\n</div>\n";
  return buffer;});
}
