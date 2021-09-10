using Microsoft.AspNetCore.Mvc;
using ProductsApi.Services;
using ProductsApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace ProductsApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ProductService _productService;

        public ProductsController(ProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public ActionResult<List<Product>> Get()
        {
            return _productService.Get();
        }

        [HttpGet("{id:length(24)}", Name = "GetProductById")]
        public ActionResult<Product> Get(string id)
        {
            var product = _productService.Get(id);
            if(product == null)
            {
                return NotFound();
            } 
            
            return product;
        }

        [HttpPost]
        public ActionResult<Product> Create(Product product)
        {
            _productService.Create(product);

            return CreatedAtRoute("GetProductById", new { id = product.Id.ToString() }, product);
        }

        [HttpPut("{id:length(24)}")]
        public IActionResult Update(string id, Product productIn)
        {
            var book = _productService.Get(id);

            if(book== null)
            {
                return NotFound();                   
            }

            _productService.Update(id, productIn);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public IActionResult Delete(string id)
        {
            var product = _productService.Get(id);

            if (product == null)
            { 
                return NotFound(); 
            }

            _productService.Remove(product.Id);

            return NoContent();
        }
    }
}
