/* G.L.T. GARMENTS - easy-to-edit shop data. Change the placeholders below! */
const GLT = {
  gcash: { num: '09XX XXX XXXX', name: 'G.L.T. GARMENTS' },   // your GCash number
  maya:  { num: '09XX XXX XXXX', name: 'G.L.T. GARMENTS' },   // your Maya number
  paypal: 'https://paypal.me/YOURNAME',                        // your PayPal.me link
  bank: 'BDO 0000 0000 0000 - G.L.T. GARMENTS'                 // your bank account
};
const PRODUCTS = [
  { id:'jogging',  name:'Jogging Pants',        price:350, cat:'Pants',    color:'#7B2FF7', desc:'Soft, stretchy and comfy.' },
  { id:'pe',       name:'PE Uniform Set',       price:650, cat:'Uniforms', color:'#00B8A9', desc:'School PE shirt and pants.' },
  { id:'polo',     name:'Polo Shirt',           price:300, cat:'Shirts',   color:'#FF6B35', desc:'Neat collar for work or school.' },
  { id:'round',    name:'Round Neck T-Shirt',   price:180, cat:'Shirts',   color:'#FF4D8D', desc:'Everyday cotton tee.' },
  { id:'vneck',    name:'V-Neck T-Shirt',       price:200, cat:'Shirts',   color:'#FFC93C', desc:'Relaxed V-neck fit.' },
  { id:'jersey',   name:'Sublimation Jersey',   price:450, cat:'Jerseys',  color:'#0B1F3A', desc:'Full-color custom team print.' }
];
const SIZES  = { 'Kids':0, 'Small-Medium':0, 'Large-XL':20, 'XXL and up':50 };      // price added per piece
const EXTRAS = { none:['No printing',0], sub:['Sublimation print',100], num:['Name / number print',60], logo:['Logo embroidery',80] };
const DISCOUNTS = [[50,15],[24,10],[12,5]];                                          // [min pieces, % off]
