---
title: SpringBoot 中测试类的编写
date: 2019-09-17 10:07:05
tags:
categories:
---

<!-- more -->

## 工具（一）：Junit4

- 注解的使用

  - @RunWith：标识为JUnit的运行环境；
- @SpringBootTest：获取启动类、加载配置，确定装载Spring Boot；
  - @Test：声明需要测试的方法；
- @BeforeClass：针对所有测试，只执行一次，且必须为static void；
  - @AfterClass：针对所有测试，只执行一次，且必须为static void；
- @Before：每个测试方法前都会执行的方法；
  - @After：每个测试方法前都会执行的方法；
- @Ignore：忽略方法；
  
- 超时测试

代码如下，给Test设置timeout属性即可，时间单位为毫秒：

> @Test(timeout = 1000)

## 工具（二）：spring-boot-starter-test

- 注解的使用
  - @RunWith(SpringRunner.class)
  - @SpringBootTest
- 断言：对结果进行验证
  - Assert
- 模拟HTTP环境
  - 注解：@AutoConfigureMockMvc
  - 工具类：MockMvc（3步）
  - perform：执行一个RequestBuilder请求，会自动执行SpringMVC的流程并映射到相应的控制器执行处理；
    - MockMvcRequestBuilders提供了get/post/put/delete/upload等http请求的方式
    - 提供了header/contentType/cookie/characterEncoding/params等设置request参数的方式
  - ResultActions
    - andExpect：添加ResultMatcher验证规则，验证控制器执行完成后结果是否正确；
    - andDo：添加ResultHandler结果处理器，比如调试时打印结果到控制台；
    - andReturn：最后返回相应的MvcResult；然后进行自定义验证/进行下一步的异步处理；
  - MvcResult（自定义Assert）
    - getModelAndView：获得控制层设置的ModeAndView对象
    - getResponse：获得最终响应结果

## 工具（三）：Mockito

- 打桩：实际上就是对接口、类、方法、参数、返回值进行伪造或者模拟。

  - ReflectionTestUtils

- 注解的使用

  - @Mock：真实对象的替代品
  - @Spy：被测试对象需要一部分被执行、一部分被mock，需要用spy对目标对象进行包装

- thenReturn与doReturn差异

  - 语法：
    - when-thenReturn
      - when(obj.method()).thenReturn(returnValue)
    - doReturn-when
      - doReturn(returnValue).when(obj).method()
  - 差异

  | API             | Mock Obj | Spy Obj |
  | :-------------- | :------- | :------ |
  | when-thenReturn | ×        | ○       |
  | doReturn-when   | ×        | ×       |

## 总结

本文详细的讲解了Junit,Mockito,以及spring boot的测试工具。