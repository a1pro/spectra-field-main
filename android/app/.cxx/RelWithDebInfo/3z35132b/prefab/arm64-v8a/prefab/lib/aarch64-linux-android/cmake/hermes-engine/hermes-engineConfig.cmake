if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/eweba1/.gradle/caches/8.14.1/transforms/fd4c5dbe7c0da8503209ec534f6629db/transformed/hermes-android-0.80.1-release/prefab/modules/libhermes/libs/android.arm64-v8a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/eweba1/.gradle/caches/8.14.1/transforms/fd4c5dbe7c0da8503209ec534f6629db/transformed/hermes-android-0.80.1-release/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

