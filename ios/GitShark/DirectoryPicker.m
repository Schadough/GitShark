//
//  DirectoryPicker.m
//  GitShark
//
//  Created by Corbin Crutchley on 6/27/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(DirectoryPicker, NSObject)

RCT_EXTERN_METHOD(pickFolder:
(RCTPromiseResolveBlock)resolve
rejecter:(RCTPromiseRejectBlock)reject)

@end
