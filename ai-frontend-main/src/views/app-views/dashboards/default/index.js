import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "store/slices/cartSlice";
import { 
  Card, Rate, Tag, Space, Button, Tabs, Modal, Carousel, Drawer, InputNumber 
} from "antd";
import { 
  HeartOutlined, ShoppingCartOutlined, LeftOutlined, RightOutlined 
} from "@ant-design/icons";

const { TabPane } = Tabs;

const products = {
  Electronics: [
    {
      id: 1,
      name: "Smartwatch",
      image: "/img/ecom/smartwatch.jpeg",
      moreImages: [
        "/img/ecom/smartwatch1.jpeg",
        "/img/ecom/smartwatch2.jpeg",
      ],
      price: 249, 
      location: "New York, USA",
      rating: 4.8,
      description: "A sleek smartwatch with fitness tracking, notifications, and long battery life.",
      material: "Brass",
      countryOfOrigin: "Philippines",
    },
    {
      id: 1,
      name: "Smartwatch",
      image: "/img/ecom/smartwatch1.jpeg",
      moreImages: [
        "/img/ecom/smartwatch1.jpeg",
        "/img/ecom/smartwatch2.jpeg",
      ],
      price: 249, 
      location: "New York, USA",
      rating: 4.8,
      description: "A sleek smartwatch with fitness tracking, notifications, and long battery life.",
      material: "Brass",
      countryOfOrigin: "Philippines",
    },
    {
      id: 1,
      name: "Smartwatch",
      image: "/img/ecom/smartwatch.jpeg",
      moreImages: [
        "/img/ecom/smartwatch1.jpeg",
        "/img/ecom/smartwatch2.jpeg",
      ],
      price: 249, 
      location: "New York, USA",
      rating: 4.8,
      description: "A sleek smartwatch with fitness tracking, notifications, and long battery life.",
      material: "Brass",
      countryOfOrigin: "Philippines",
    },
    {
      id: 1,
      name: "Smartwatch",
      image: "/img/ecom/smartwatch.jpeg",
      moreImages: [
        "/img/ecom/smartwatch1.jpeg",
        "/img/ecom/smartwatch2.jpeg",
      ],
      price: 249, 
      location: "New York, USA",
      rating: 4.8,
      description: "A sleek smartwatch with fitness tracking, notifications, and long battery life.",
      material: "Brass",
      countryOfOrigin: "Philippines",
    },
    {
      id: 1,
      name: "Smartwatch",
      image: "/img/ecom/smartwatch.jpeg",
      moreImages: [
        "/img/ecom/smartwatch1.jpeg",
        "/img/ecom/smartwatch2.jpeg",
      ],
      price: 249, 
      location: "New York, USA",
      rating: 4.8,
      description: "A sleek smartwatch with fitness tracking, notifications, and long battery life.",
      material: "Brass",
      countryOfOrigin: "Philippines",
    },
    {
      id: 2,
      name: "Smartphone",
      image: "/img/ecom/smartphone.jpg",
      moreImages: [
        "/img/ecom/smartphone1.jpg",
        "/img/ecom/smartphone2.jpg",
      ],
      price: 699,
      location: "Los Angeles, USA",
      rating: 4.7,
      description: "A powerful smartphone with an amazing camera and a smooth user experience.",
      material: "Aluminum & Glass",
      countryOfOrigin: "China",
    }
  ],
  
};

const ProductCard = ({ product, onShowDetails, onAddToCart }) => {
  return (
    <Card
      hoverable
      cover={
        <img
          alt={product.name}
          src={product.image}
          style={{ height: "180px", objectFit: "cover", cursor: "pointer" }}
          onClick={() => onShowDetails(product)}
        />
      }
      style={{ width: 230 }}
      bodyStyle={{ padding: "12px" }}
    >
      <div style={{ position: "absolute", top: "8px", left: "8px" }}>
        <Tag color="blue">Best Seller</Tag>
      </div>
      <div style={{ position: "absolute", top: "8px", right: "8px" }}>
        <HeartOutlined style={{ fontSize: "16px", color: "#888", cursor: "pointer" }} />
      </div>
      <Space direction="vertical" size="small">
        <h3 style={{ fontSize: "14px", fontWeight: "600" }}>{product.name}</h3>
        <span style={{ fontSize: "12px", color: "gray" }}>{product.location}</span>
        <Rate disabled defaultValue={product.rating} count={5} style={{ fontSize: "12px" }} />
        <span style={{ fontSize: "14px", fontWeight: "bold" }}>${product.price}</span>
        <Button type="primary" size="small" icon={<ShoppingCartOutlined />} onClick={() => onAddToCart(product)}>
          Add to Cart
        </Button>
      </Space>
    </Card>
  );
};

const EcommerceTabs = () => {
  const [activeTab, setActiveTab] = useState("Electronics");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const carouselRef = useRef(null);
  const dispatch = useDispatch();

  const handleShowDetails = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setDrawerVisible(true);
    setQuantity(1); // Reset quantity when opening drawer
  };

  const handleConfirmAdd = () => {
    if (selectedProduct) {
      dispatch(addItem({ ...selectedProduct, quantity }));
      setDrawerVisible(false); // Close the cart drawer after adding
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Tabs defaultActiveKey="Electronics" onChange={setActiveTab}>
        {Object.keys(products).map((category) => (
          <TabPane tab={category} key={category}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "16px" }}>
              {products[category].map((product) => (
                <ProductCard key={product.id} product={product} onShowDetails={handleShowDetails} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </TabPane>
        ))}
      </Tabs>

      {/* Product Details Modal */}
      <Modal
        title={selectedProduct?.name}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        centered
      >
        {selectedProduct && (
          <div style={{ textAlign: "center", position: "relative" }}>
            <div style={{ position: "relative" }}>
              <Button shape="circle" icon={<LeftOutlined />} onClick={() => carouselRef.current?.prev()} style={{ position: "absolute", top: "50%", left: "-10px", transform: "translateY(-50%)", zIndex: 10 }} />
              <Carousel autoplay ref={carouselRef} arrows={false}>
                {[selectedProduct.image, ...(selectedProduct.moreImages || [])].map((img, index) => (
                  <div key={index}>
                    <img src={img} alt={`${selectedProduct.name} ${index + 1}`} style={{ width: "100%", maxHeight: "300px", objectFit: "contain" }} />
                  </div>
                ))}
              </Carousel>
              <Button shape="circle" icon={<RightOutlined />} onClick={() => carouselRef.current?.next()} style={{ position: "absolute", top: "50%", right: "-10px", transform: "translateY(-50%)", zIndex: 10 }} />
            </div>
            <p style={{ margin: "15px 0", fontSize: "14px", color: "#666" }}>{selectedProduct.description}</p>
            <p><strong>Price:</strong> ${selectedProduct.price}</p>
            <Button type="primary" icon={<ShoppingCartOutlined />} size="large" onClick={() => handleAddToCart(selectedProduct)}>Add to Cart</Button>
          </div>
        )}
      </Modal>

      {/* Product Details Drawer */}
      <Drawer
        title="Add to Cart"
        placement="right"
        closable={true}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={350}
        zIndex={1100}
      >
        {selectedProduct && (
          <div>
            <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: "100%", height: "180px", objectFit: "cover", marginBottom: "10px" }} />
            <h3>{selectedProduct.name}</h3>
            <p>{selectedProduct.description}</p>
            <p><strong>Price per item:</strong> ${selectedProduct.price}</p>
            <div style={{ marginBottom: "20px" }}>
              <span style={{ marginRight: "10px" }}>Quantity:</span>
              <InputNumber min={1} max={10} value={quantity} onChange={(value) => setQuantity(value)} />
            </div>
            <p><strong>Total Price:</strong> ${selectedProduct.price * quantity}</p>
            <Button type="primary" block icon={<ShoppingCartOutlined />} onClick={handleConfirmAdd}>
              Confirm & Add to Cart
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default EcommerceTabs;
