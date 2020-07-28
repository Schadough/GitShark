//
//  DirectoryPicker.swift
//  GitShark
//
//  Created by Corbin Crutchley on 6/27/20.
//  Copyright © 2020 OceanBit. All rights reserved.
//

import UIKit
import MobileCoreServices

@objc(DirectoryPicker)
class DirectoryPicker: NSObject, UIDocumentPickerDelegate {
  var resolve: RCTPromiseResolveBlock? = nil;
  var reject: RCTPromiseRejectBlock? = nil;
  func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
    let paths = urls.map({ $0.path })
    resolve!(paths)
  }

  func documentPickerWasCancelled(_ controller: UIDocumentPickerViewController) {
    resolve!(nil);
  }

  @objc(pickFolder:rejecter:)
  public func pickFolder(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject:@escaping RCTPromiseRejectBlock) -> Void {
    self.resolve = resolve;
    self.reject = reject;
    DispatchQueue.main.async {
      let documentPicker =
          UIDocumentPickerViewController(documentTypes: [kUTTypeFolder as String],
                                         in: .open)
          documentPicker.delegate = self
      self.topMostViewController()?.present(documentPicker, animated: true, completion: nil)
    }
  }
   
  @objc
  fileprivate func topMostViewController() -> UIViewController? {
       var ret: UIViewController? = UIApplication.shared.keyWindow?.rootViewController
       repeat {
           if let presented = ret?.presentedViewController {
               ret = presented
           } else {
               break
           }
       } while(true)
       return ret
   }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
