<!-- prettier-ignore-start -->

# demo_canvas

保存学习 canvas 的过程中的一些 demo

## 基础知识需求

- 代数运算

- 三角函数

  - sin  
    - y = sin(angle) * r

  - cos
    - x = cos(angle) * r

  - tan
    - tan(angle) = y / x

- 向量运算
  - **向量的运算需要结合具体的几何意义来考虑**

  - 向量的加法及其几何意义
    - 两个向量相加 等于两个向量的x、y分别相加

  - 向量的减法及其几何意义
    - 两个向量相减 等于两个向量的x、y分别相减

  - 向量的大小
    - 向量的大小使用勾股定理计算得到

  - 单位向量
    - 长度为单位1，只有方向
    - 计算方式
  
    ```js
    var vectorM = Math.sqrt(Math.pow(vector.x ,2) + Math.pow(vector.y,2))
    var unitVector = new Vector();

    unitVector.x = vector.x / vectorM;
    unitVector.y = vector.y / vectorM;
    ```

  - 向量的点积

    - 将两个向量的对应分量分别相乘再相加

## 目录

- demo1-绘制钟表

<!-- prettier-ignore-end -->
