package com.review.shop.controller.admin;

import com.review.shop.dto.product.*;
import com.review.shop.service.admin.AdminProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Admin API", description = "상품 관련 관리자 기능 API")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminProductService adminProductService;


    @Operation(summary = "전체 상품 목록 조회 (어드민용)", description = "어드민 페이지에서 사용할 전체 상품 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "상품 목록 조회 성공",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = ProductDetailWithThumbnailDTO.class)))
            ),
            @ApiResponse(responseCode = "400", description = "백엔드 오류",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))

    })
    @GetMapping("/allproducts")
    public ResponseEntity<?> getAllProducts() {
        return ResponseEntity.ok(adminProductService.getAllProducts());
    }




    @Operation(summary = "상품 등록", description = "새로운 상품을 등록합니다. 12/05 추가 : objectKey키를 모아서 한번에 product_images_list로 reqeust 하시면 됩니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "상품 등록 성공"),
            @ApiResponse(responseCode = "400", description = "백엔드 오류"),
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PostMapping("/products")

    //api/images/products 에서 이미지 업로드 후 받은 이미지 경로 리스트와 상품 정보와, 프론트가 선택한 썸네일 정보를 같이 request body로 받음
    public ResponseEntity<String> insertProduct(@io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "상품 등록 정보",
            required = true,
            content = @Content(
                    mediaType = "application/json",
                    examples = @ExampleObject(
                            name = "상품 등록 예시",
                            value = """
                {
                  "product_images_list": [
                    "/uploads/products/33c01284-8085-4f34-83fe-9a5a0b38780a.jpg",
                    "/uploads/products/e7ac40e4-44b0-4d1b-90c2-7e4ec095afda.jpg"
                  ],
                  "product": {
                    "prd_name": "테스트상품입니다1111111111111111111",
                    "prd_brand": "이니스프리",
                    "ingredient": "정제수, 글리세린, 부틸렌글라이콜",
                    "price": 25000,
                    "category": "skincare",
                    "stock": 100,
                    "description": "건성 피부에 좋은 수분 크림입니다.",
                    "baumann_id": 3,
                    "is_sold_out": "1"
                  },
                  "thumbnailUrl": "/uploads/products/33c01284-8085-4f34-83fe-9a5a0b38780a.jpg"
                }
                """
                    )
            )
    )@RequestBody ProductUploadDTO productUploadDTO) {

        ProductDetailDTO product = productUploadDTO.getProduct();

        // 이미지 리스트 유효성 검사
        if(productUploadDTO.getProduct_images_list() == null || productUploadDTO.getProduct_images_list().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("상품 이미지는 최소 하나 이상 등록되어야 합니다.");
        }
        // 썸네일 유효성 검사
        if(productUploadDTO.getThumbnailUrl() == null || productUploadDTO.getThumbnailUrl().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("썸네일 이미지는 반드시 선택되어야 합니다.");
        }

        // product DTO에 이미지 리스트 설정
        product.setProduct_images(productUploadDTO.getProduct_images_list());


        // product DTO 업로드, 썸네일 이미지 정보도 전송
        adminProductService.uploadProductAndImages(product,productUploadDTO.getThumbnailUrl());

        return ResponseEntity.status(HttpStatus.CREATED).body("상품이 등록되었습니다");
    }

    @Operation(summary = "상품 수정", description = "기존 상품의 정보를 수정합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "상품 수정 성공"),
            @ApiResponse(responseCode = "400", description = "백엔드 오류")
            ,
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PatchMapping("/products/{product_id}")
    public ResponseEntity<String> updateProduct(
            @Parameter(description = "수정할 상품의 ID") @PathVariable int product_id,
            @RequestBody ProductUpdateOnlyPrdInfoDTO product) {
        adminProductService.updateProduct(product_id, product);
        return ResponseEntity.ok("상품이 수정되었습니다");
    }

    @Operation(summary = "상품 삭제 (논리적)", description = "상품을 논리적으로 삭제합니다. (DELETED_DATE 설정)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "상품 삭제 성공"),
            @ApiResponse(responseCode = "400", description = "백엔드 오류")
            ,
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @DeleteMapping("/products/{product_id}")
    public ResponseEntity<String> deleteProduct(
            @Parameter(description = "삭제할 상품의 ID") @PathVariable int product_id) {
        adminProductService.deleteProduct(product_id);
        return ResponseEntity.ok("상품이 삭제되었습니다");
    }

    @Operation (summary = "상품 상세 조회", description = "특정 상품의 상세 정보를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "상품 상세 조회 성공",
                    content = @Content(schema = @Schema(implementation = ProductDetailWithThumbnailDTO.class))
            ),
            @ApiResponse(responseCode = "400", description = "백엔드 오류",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @GetMapping("/products/{product_id}")
    public ResponseEntity<?> getProductDetail(
            @Parameter(description = "조회할 상품의 ID") @PathVariable int product_id) {
        ProductDetailWithThumbnailDTO detailDTO = adminProductService.getProductDetail(product_id);

        detailDTO.setThumbnail_url(adminProductService.readImage(product_id));
        return ResponseEntity.ok(detailDTO);
    }

    //이미지 업데이트 API
    @Operation(summary = "상품 이미지 업데이트", description = "상품의 이미지를 업데이트합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "상품 이미지 업데이트 성공"),
            @ApiResponse(responseCode = "400", description = "백엔드 오류"),
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PutMapping("/products/{product_id}/images")
    public ResponseEntity<String> updateProductImages(
            @Parameter(description = "이미지를 업데이트할 상품의 ID") @PathVariable int product_id,
            @RequestBody ProductUpdateOnlyImageDTO productUpdateOnlyImageDTO) {
        // 이미지 리스트 유효성 검사
        if(productUpdateOnlyImageDTO.getProduct_images_list() == null || productUpdateOnlyImageDTO.getProduct_images_list().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("상품 이미지는 최소 하나 이상 등록되어야 합니다.");
        }
        // 썸네일 유효성 검사
        if(productUpdateOnlyImageDTO.getThumbnailUrl() == null || productUpdateOnlyImageDTO.getThumbnailUrl().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("썸네일 이미지는 반드시 선택되어야 합니다.");
        }
        adminProductService.updateProductImages(product_id, productUpdateOnlyImageDTO.getProduct_images_list(), productUpdateOnlyImageDTO.getThumbnailUrl());
        return ResponseEntity.ok("상품 이미지가 업데이트되었습니다");
    }


}
